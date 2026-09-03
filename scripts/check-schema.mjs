/**
 * 프로젝트 쿼리 ↔ 스키마 정합성 검사
 *
 * 두 가지 모드가 있다.
 *   (기본)   db/schema.sql 파일과 대조   — DB 가 없어도 돌아 CI 회귀 검사에 쓴다.
 *   --live   실제 DB 와 대조             — 파일이 아니라 살아있는 DB 를 기준으로 본다.
 *
 * 파일 대조만으로는 "스키마 파일에는 있지만 DB 에는 없는 테이블"을 잡지 못한다.
 * 배포 전에는 반드시 --live 로 확인할 것.
 *
 * 사용법:
 *   node scripts/check-schema.mjs                 # db/schema.sql 과 대조
 *   node scripts/check-schema.mjs --live          # .env.local 의 DB_* 로 접속해 대조
 *   node scripts/check-schema.mjs --live --legacy # LEGACY_DB_* 로 접속해 대조
 * 종료코드: 문제가 있으면 1
 */
import fs from 'node:fs';
import path from 'node:path';

/* ------------------------------------------------------------------ */
/* 1. db/schema.sql 파싱                                               */
/* ------------------------------------------------------------------ */

const live = process.argv.includes('--live');
const useLegacy = process.argv.includes('--legacy');

/** 테이블명(대문자) → 컬럼명 Set */
let schema = new Map();
let schemaLabel = 'db/schema.sql';

const schemaSql = fs.readFileSync(path.join('db', 'schema.sql'), 'utf8');

for (const block of schemaSql.split(/CREATE TABLE IF NOT EXISTS\s+/i).slice(1)) {
  const tableName = block.match(/^([A-Za-z0-9_]+)/)?.[1]?.toUpperCase();

  if (!tableName) continue;

  const body = block.slice(block.indexOf('('), block.lastIndexOf(') ENGINE'));
  const columns = new Set();

  for (const line of body.split('\n')) {
    const trimmed = line.trim();

    // 컬럼 정의만 취한다. (PRIMARY KEY / KEY / CONSTRAINT 행은 제외)
    const matched = trimmed.match(/^([A-Z][A-Z0-9_]*)\s+[A-Z]/);

    if (!matched) continue;
    if (/^(PRIMARY|KEY|UNIQUE|CONSTRAINT|FOREIGN|INDEX)\b/i.test(trimmed)) continue;

    columns.add(matched[1]);
  }

  schema.set(tableName, columns);
}

/* 1-b. --live : 실제 DB 에서 다시 읽는다 ------------------------------ */

if (live) {
  const envPath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('.env.local 이 없어 --live 로 확인할 수 없습니다.');
    process.exit(1);
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const matched = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

    if (matched) process.env[matched[1]] = matched[2].replace(/^["'](.*)["']$/, '$1');
  }

  const prefix = useLegacy ? 'LEGACY_DB_' : 'DB_';
  const host = process.env[useLegacy ? 'LEGACY_DB_HOST' : 'DB_ADDRESS'];
  const user = process.env[useLegacy ? 'LEGACY_DB_USER' : 'DB_ID'];
  const name = process.env[useLegacy ? 'LEGACY_DB_NAME' : 'DB_NAME'];

  if (!host || !user || !name) {
    console.error(`.env.local 의 ${prefix}* 접속 정보가 비어 있습니다.`);
    process.exit(1);
  }

  const { default: mysql } = await import('mysql2/promise');

  const connection = await mysql.createConnection({
    host,
    port: Number(process.env[useLegacy ? 'LEGACY_DB_PORT' : 'DB_PORT'] ?? 3306),
    user,
    password: process.env[useLegacy ? 'LEGACY_DB_PASSWORD' : 'DB_PASSWORD'],
    database: name,
    charset: 'utf8mb4',
    connectTimeout: 15_000,
  });

  const [columns] = await connection.query(
    `SELECT TABLE_NAME, COLUMN_NAME
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?`,
    [name],
  );

  await connection.end();

  schema = new Map();

  for (const row of columns) {
    const table = String(row.TABLE_NAME).toUpperCase();

    if (!schema.has(table)) schema.set(table, new Set());

    schema.get(table).add(String(row.COLUMN_NAME).toUpperCase());
  }

  schemaLabel = `${name}@${host} (실제 DB)`;
}

/* ------------------------------------------------------------------ */
/* 2. 프로젝트 SQL 수집                                                */
/* ------------------------------------------------------------------ */

/** SQL 태그드 템플릿을 쓰는 소스 파일을 모은다. */
function collectSources(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) collectSources(full, found);
    else if (/\.(ts|tsx)$/.test(entry.name)) found.push(full);
  }

  return found;
}

const sources = ['app', 'lib', 'common'].flatMap((dir) =>
  fs.existsSync(dir) ? collectSources(dir) : [],
);

/** SQL 안에서 무시할 토큰 (예약어 · 함수 · 별칭) */
const IGNORED = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'AS', 'ON', 'JOIN', 'LEFT',
  'RIGHT', 'INNER', 'OUTER', 'ORDER', 'GROUP', 'BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT',
  'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'IGNORE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'DESC', 'ASC', 'COUNT', 'MAX', 'MIN', 'SUM', 'AVG', 'COALESCE', 'CONCAT', 'NOW', 'DATE_FORMAT',
  'DATE_SUB', 'INTERVAL', 'MINUTE', 'DISTINCT', 'EXISTS', 'DUAL', 'TRUE', 'FALSE', 'LIKE',
  'CHAR_LENGTH', 'LENGTH', 'IFNULL', 'CAST', 'CONVERT', 'ROW_COUNT', 'DESC',
]);

/** 별칭(1~2글자 대문자, 또는 A/B/M1 같은 것) 인지 */
const isAlias = (token) => /^[A-Z]{1,2}\d?$/.test(token);

const problems = [];
let checkedQueries = 0;

for (const file of sources) {
  const text = fs.readFileSync(file, 'utf8');

  // SQL`...` 템플릿 추출
  for (const match of text.matchAll(/SQL`([\s\S]*?)`/g)) {
    // ${...} 보간 자리는 바인딩 값이므로 SQL 식별자로 보지 않는다.
    const sql = match[1].replace(/\$\{[^}]*\}/g, '?');

    // 이 쿼리가 건드리는 테이블 (신규 TBL_* / 레거시 tb_* 모두)
    //   테이블·컬럼명은 대문자로 정규화해 비교한다. MySQL 이 식별자 대소문자를
    //   구분하지 않기 때문에, 레거시 소문자 컬럼도 같은 기준으로 볼 수 있다.
    const tables = [...sql.matchAll(/\b(TBL_[A-Za-z0-9_]+|tb_[A-Za-z0-9_]+)\b/g)].map((m) =>
      m[1].toUpperCase(),
    );

    if (tables.length === 0) continue;

    checkedQueries += 1;

    const line = text.slice(0, match.index).split('\n').length;

    // 2-1. 존재하지 않는 테이블
    for (const table of new Set(tables)) {
      if (!schema.has(table)) {
        problems.push({ file, line, kind: '없는 테이블', detail: table });
      }
    }

    // 2-2. 존재하지 않는 컬럼
    //     쿼리에 등장하는 대문자 토큰 중, 참조 테이블 어디에도 없는 것을 찾는다.
    const known = new Set();
    for (const table of new Set(tables)) {
      for (const column of schema.get(table) ?? []) known.add(column.toUpperCase());
    }

    // 별칭.컬럼 형태와 단독 컬럼을 모두 본다. (문자열 리터럴은 제외)
    const withoutLiterals = sql.replace(/'[^']*'/g, "''");

    for (const token of new Set(
      [...withoutLiterals.matchAll(/\b([A-Za-z][A-Za-z0-9_]{2,})\b/g)].map((m) =>
        m[1].toUpperCase(),
      ),
    )) {
      if (IGNORED.has(token) || isAlias(token) || token.startsWith('TBL_') || token.startsWith('TB_')) continue;
      if (known.has(token)) continue;

      // AS 로 만든 별칭(SELECT ... AS FOO)은 컬럼이 아니다.
      if (new RegExp(`\\bAS\\s+${token}\\b`).test(withoutLiterals)) continue;

      problems.push({
        file,
        line,
        kind: '스키마에 없는 컬럼',
        detail: `${token}  (참조 테이블: ${[...new Set(tables)].join(', ')})`,
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* 3. 결과                                                             */
/* ------------------------------------------------------------------ */

console.log(`# 기준 : ${schemaLabel}  — 테이블 ${schema.size}개`);
for (const [table, columns] of schema) {
  console.log(`  ${table.padEnd(22)} 컬럼 ${columns.size}개`);
}

console.log(`\n# 검사한 쿼리 : ${checkedQueries}개  (파일 ${sources.length}개 스캔)`);

if (problems.length === 0) {
  console.log('\n✔ 쿼리와 스키마가 모두 일치합니다.');
  process.exit(0);
}

console.log(`\n✘ 불일치 ${problems.length}건\n`);

for (const problem of problems) {
  console.log(`  [${problem.kind}] ${problem.file}:${problem.line}`);
  console.log(`      ${problem.detail}`);
}

process.exit(1);
