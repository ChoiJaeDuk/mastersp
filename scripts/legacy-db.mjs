/**
 * 레거시 MySQL(회사홈페이지) 접속 확인 / 스키마 조사
 *
 * 운영 DB 이므로 조회만 한다. (SELECT / SHOW 외의 구문은 실행하지 않는다)
 * 접속 정보는 .env.local 의 LEGACY_DB_* 에서 읽는다.
 *
 * 사용법:
 *   node scripts/legacy-db.mjs                 # 접속 확인 + 테이블 목록/건수
 *   node scripts/legacy-db.mjs tb_history      # 특정 테이블 구조 + 표본 5건
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

/** .env.local 을 읽어 process.env 에 채운다. (dotenv 의존성 없이 처리) */
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('.env.local 이 없습니다.');
    process.exit(1);
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const matched = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

    if (!matched) continue;

    const [, key, rawValue] = matched;
    process.env[key] = rawValue.replace(/^["'](.*)["']$/, '$1');
  }
}

loadEnv();

const target = process.argv[2];

const connection = await mysql.createConnection({
  host: process.env.LEGACY_DB_HOST,
  port: Number(process.env.LEGACY_DB_PORT ?? 3306),
  user: process.env.LEGACY_DB_USER,
  password: process.env.LEGACY_DB_PASSWORD,
  database: process.env.LEGACY_DB_NAME,
  // 레거시가 utf8 / utf8mb4 를 섞어 쓰므로 넓은 쪽으로 읽는다.
  charset: 'utf8mb4',
  connectTimeout: 15_000,
});

const [[version]] = await connection.query('SELECT VERSION() AS v, @@version_comment AS c');

console.log(`# 접속 성공 : ${process.env.LEGACY_DB_NAME}@${process.env.LEGACY_DB_HOST}`);
console.log(`# 서버      : ${version.v}  (${version.c})`);
console.log('');

if (target) {
  const [columns] = await connection.query(`SHOW FULL COLUMNS FROM \`${target}\``);

  console.log(`## ${target} — 컬럼 ${columns.length}개`);
  for (const column of columns) {
    const nullable = column.Null === 'NO' ? 'NOT NULL' : 'NULL';
    console.log(
      `  - ${String(column.Field).padEnd(20)} ${String(column.Type).padEnd(24)} ${nullable}` +
        (column.Comment ? `  // ${column.Comment}` : ''),
    );
  }

  const [rows] = await connection.query(`SELECT * FROM \`${target}\` LIMIT 5`);
  console.log(`\n## 표본 ${rows.length}건`);
  console.log(JSON.stringify(rows, null, 2).slice(0, 4000));
} else {
  const [tables] = await connection.query(
    `SELECT TABLE_NAME, TABLE_ROWS, ENGINE, TABLE_COLLATION
       FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME`,
    [process.env.LEGACY_DB_NAME],
  );

  console.log(`# 테이블 ${tables.length}개`);
  for (const table of tables) {
    // information_schema.TABLE_ROWS 는 추정치라 실제 건수를 따로 센다.
    const [[count]] = await connection.query(
      `SELECT COUNT(*) AS c FROM \`${table.TABLE_NAME}\``,
    );

    console.log(
      `  ${String(table.TABLE_NAME).padEnd(24)} ${String(count.c).padStart(7)}건  ` +
        `${String(table.ENGINE).padEnd(8)} ${table.TABLE_COLLATION}`,
    );
  }
}

await connection.end();
