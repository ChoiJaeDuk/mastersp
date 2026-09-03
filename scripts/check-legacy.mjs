/**
 * 레거시 MySQL 실제 구조 ↔ 마이그레이션 스크립트 정합성 검사
 *
 * scripts/migrate-legacy.mjs 는 sadmin/setting/default.sql(덤프 파일)을 보고 만들었으므로,
 * 운영 DB 의 실제 구조와 어긋나 있을 수 있다. 여기서 살아있는 DB 를 직접 조회해 확인한다.
 *
 * 확인 항목
 *   1) 마이그레이션이 SELECT 하는 컬럼이 실제로 있는지
 *   2) 컬럼 타입 / NULL 허용 / 키 / 인덱스
 *   3) 신규 스키마의 길이 제한을 넘는 데이터가 있는지
 *
 * 사용법: node scripts/check-legacy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('.env.local 이 없습니다.');
    process.exit(1);
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const matched = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

    if (matched) process.env[matched[1]] = matched[2].replace(/^["'](.*)["']$/, '$1');
  }
}

loadEnv();

/** 마이그레이션이 실제로 읽는 컬럼 (migrate-legacy.mjs 의 SELECT 목록과 동일해야 한다) */
const USED = {
  tb_history: ['year', 'month', 'content', 'sortnum', 'viewtype', 'lantype'],
  tb_category: ['cateno', 'catename', 'sortnum', 'viewtype', 'tablename', 'lantype'],
  tb_project: [
    'mode', 'depth1', 'title', 'content', 'sdate', 'edate',
    'field_etc_01', 'sortnum', 'viewtype', 'lantype',
  ],
  tb_inquiry: [
    'title', 'field_etc_01', 'field_etc_02', 'uname', 'utel', 'uemail',
    'content', 'content1', 'reply_date', 'reg_date',
  ],
  tb_yark: ['mode', 'content'],
};

/** 신규 스키마의 길이 제한 (초과 데이터가 있으면 옮길 때 잘린다) */
const LIMITS = [
  { table: 'tb_history', column: 'content', max: null, target: 'TBL_HP_HISTORY.HIST_CTT (TEXT)' },
  { table: 'tb_category', column: 'catename', max: 255, target: 'TBL_HP_PROJECT_CTG.CTG_NM VARCHAR(255)' },
  { table: 'tb_project', column: 'title', max: 255, target: 'TBL_HP_PROJECT.PRJ_NM VARCHAR(255)' },
  { table: 'tb_project', column: 'field_etc_01', max: 255, target: 'TBL_HP_PROJECT.ORDR_NM VARCHAR(255)' },
  { table: 'tb_inquiry', column: 'title', max: 255, target: 'TBL_HP_INQUIRY.INQ_FLD_NM VARCHAR(255)' },
  { table: 'tb_inquiry', column: 'uname', max: 50, target: 'TBL_HP_INQUIRY.WRTR_NM VARCHAR(50)' },
  { table: 'tb_inquiry', column: 'utel', max: 30, target: 'TBL_HP_INQUIRY.WRTR_TELNO VARCHAR(30)' },
  { table: 'tb_inquiry', column: 'uemail', max: 250, target: 'TBL_HP_INQUIRY.WRTR_EML VARCHAR(250)' },
];

const connection = await mysql.createConnection({
  host: process.env.LEGACY_DB_HOST,
  port: Number(process.env.LEGACY_DB_PORT ?? 3306),
  user: process.env.LEGACY_DB_USER,
  password: process.env.LEGACY_DB_PASSWORD,
  database: process.env.LEGACY_DB_NAME,
  charset: 'utf8mb4',
  connectTimeout: 15_000,
});

const [[version]] = await connection.query('SELECT VERSION() AS V');
console.log(`# 레거시 : ${process.env.LEGACY_DB_NAME}@${process.env.LEGACY_DB_HOST} (MySQL ${version.V})\n`);

const problems = [];

/* 1) 컬럼 존재 여부 + 구조 출력 --------------------------------------- */
for (const [table, usedColumns] of Object.entries(USED)) {
  const [columns] = await connection.query(`SHOW FULL COLUMNS FROM \`${table}\``);
  const actual = new Map(columns.map((c) => [c.Field, c]));

  console.log(`## ${table}  (전체 컬럼 ${columns.length}개 / 사용 ${usedColumns.length}개)`);

  for (const name of usedColumns) {
    const column = actual.get(name);

    if (!column) {
      problems.push(`${table}.${name} : 실제 DB 에 없는 컬럼을 SELECT 하고 있음`);
      console.log(`  ✘ ${name.padEnd(14)} — 없음`);
      continue;
    }

    const nullable = column.Null === 'NO' ? 'NOT NULL' : 'NULL';
    console.log(
      `  - ${name.padEnd(14)} ${String(column.Type).padEnd(16)} ${nullable.padEnd(9)}` +
        (column.Key ? ` ${column.Key}` : ''),
    );
  }

  const [indexes] = await connection.query(`SHOW INDEX FROM \`${table}\``);
  const indexNames = [...new Set(indexes.map((i) => `${i.Key_name}(${i.Column_name})`))];
  console.log(`  # 인덱스 : ${indexNames.length ? indexNames.join(', ') : '없음'}\n`);
}

/* 2) 신규 스키마 길이 초과 데이터 -------------------------------------- */
console.log('## 신규 스키마 길이 제한 초과 검사');

for (const { table, column, max, target } of LIMITS) {
  if (max === null) continue;

  const [[row]] = await connection.query(
    `SELECT COUNT(*) AS C, COALESCE(MAX(CHAR_LENGTH(\`${column}\`)), 0) AS L
       FROM \`${table}\` WHERE CHAR_LENGTH(\`${column}\`) > ?`,
    [max],
  );

  if (row.C > 0) {
    problems.push(`${table}.${column} : ${row.C}건이 ${max}자를 넘음(최대 ${row.L}자) → ${target}`);
    console.log(`  ✘ ${table}.${column} : ${row.C}건 초과 (최대 ${row.L}자 / 한도 ${max}) → ${target}`);
  } else {
    console.log(`  ✔ ${table}.${column} (한도 ${max})`);
  }
}

/* 3) 옮기지 않는 데이터 확인 ------------------------------------------ */
console.log('\n## 옮기지 않는 데이터');

const [[eng]] = await connection.query(
  "SELECT COUNT(*) AS C FROM tb_project WHERE lantype <> '1'",
);
console.log(`  - tb_project 영문(lantype<>1) ${eng.C}건 : 국문 전용 사이트라 제외`);

const [[orphan]] = await connection.query(
  `SELECT COUNT(*) AS C FROM tb_project P
    WHERE P.lantype = '1'
      AND P.depth1 NOT IN (SELECT cateno FROM tb_category WHERE tablename='tb_project' AND lantype='1')`,
);
console.log(`  - tb_project 분류 연결 끊김 ${orphan.C}건 : 분류 없음으로 이관`);

/* 4) 타입 축소 / NOT NULL 전환 위험 ------------------------------------ */
console.log('\n## 타입 축소 · NOT NULL 전환 위험');

// 레거시 mediumtext(16MB) -> 신규 TEXT(65,535 byte). 초과분은 잘린다.
const TEXT_MAX_BYTES = 65535;

for (const [table, column, target] of [
  ['tb_project', 'content', 'TBL_HP_PROJECT.PRJ_CTT TEXT'],
  ['tb_inquiry', 'content', 'TBL_HP_INQUIRY.INQ_CTT TEXT'],
  ['tb_inquiry', 'content1', 'TBL_HP_INQUIRY.RPLY_CTT TEXT'],
  ['tb_yark', 'content', 'TBL_HP_TERM.TERM_CTT MEDIUMTEXT'],
]) {
  const [[row]] = await connection.query(
    `SELECT COALESCE(MAX(LENGTH(\`${column}\`)), 0) AS B FROM \`${table}\``,
  );

  const limit = target.includes('MEDIUMTEXT') ? 16777215 : TEXT_MAX_BYTES;

  if (row.B > limit) {
    problems.push(`${table}.${column} : 최대 ${row.B}바이트로 ${target} 한도(${limit})를 넘음`);
    console.log(`  ✘ ${table}.${column} : 최대 ${row.B} byte > ${limit} → ${target}`);
  } else {
    console.log(`  ✔ ${table}.${column} : 최대 ${row.B} byte (한도 ${limit}) → ${target}`);
  }
}

// 레거시 NULL 허용 -> 신규 NOT NULL 인 컬럼에 빈 값이 있는지
for (const [table, column, target] of [
  ['tb_history', 'month', 'TBL_HP_HISTORY.HIST_MM CHAR(2) NOT NULL'],
  ['tb_history', 'year', 'TBL_HP_HISTORY.HIST_YR CHAR(4) NOT NULL'],
  ['tb_inquiry', 'uemail', 'TBL_HP_INQUIRY.WRTR_EML NOT NULL'],
]) {
  const [[row]] = await connection.query(
    `SELECT COUNT(*) AS C FROM \`${table}\`
      WHERE \`${column}\` IS NULL OR \`${column}\` = ''`,
  );

  if (row.C > 0) {
    console.log(`  ! ${table}.${column} : 빈 값 ${row.C}건 → ${target} (마이그레이션에서 기본값 대체)`);
  } else {
    console.log(`  ✔ ${table}.${column} : 빈 값 없음 → ${target}`);
  }
}

// ENUM 으로 좁힌 컬럼에 예상 밖 값이 있는지
for (const [table, column, allowed] of [
  ['tb_project', 'mode', ['1', '2']],
  ['tb_yark', 'mode', ['1', '2', '3']],
]) {
  const [rows] = await connection.query(
    `SELECT DISTINCT \`${column}\` AS V FROM \`${table}\``,
  );
  const values = rows.map((r) => String(r.V));
  const unexpected = values.filter((v) => !allowed.includes(v));

  if (unexpected.length > 0) {
    problems.push(`${table}.${column} : ENUM 밖의 값 ${unexpected.join(', ')}`);
    console.log(`  ✘ ${table}.${column} : 예상 밖 값 [${unexpected.join(', ')}] (허용 ${allowed.join('/')})`);
  } else {
    console.log(`  ✔ ${table}.${column} : [${values.join(', ')}] (허용 ${allowed.join('/')})`);
  }
}

await connection.end();

console.log('');

if (problems.length === 0) {
  console.log('✔ 마이그레이션이 참조하는 구조가 실제 DB 와 모두 일치합니다.');
  process.exit(0);
}

console.log(`✘ 확인 필요 ${problems.length}건\n`);
problems.forEach((p) => console.log(`  - ${p}`));
process.exit(1);
