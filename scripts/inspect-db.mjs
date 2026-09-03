/**
 * 신규 MySQL 스키마 조사 스크립트
 *
 * .env.local 의 DB_* 접속 정보로 붙어 테이블/컬럼/인덱스를 덤프한다.
 * db/schema.sql 이 실제로 어떻게 만들어졌는지 확인할 때 사용한다.
 *
 * 사용법:
 *   node scripts/inspect-db.mjs                 # 전체 테이블 + 건수
 *   node scripts/inspect-db.mjs TBL_SYS_        # 접두어로 필터
 *   node scripts/inspect-db.mjs TBL_SYS_ --ddl  # SHOW CREATE TABLE 출력
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

/** .env.local 을 읽어 process.env 에 채운다. (dotenv 의존성 없이 처리) */
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('.env.local 이 없습니다. .env.example 을 복사해서 값을 채워 주세요.');
    process.exit(1);
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const matched = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

    if (matched) process.env[matched[1]] = matched[2].replace(/^["'](.*)["']$/, '$1');
  }
}

loadEnv();

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '';
const asDdl = process.argv.includes('--ddl');

const connection = await mysql.createConnection({
  host: process.env.DB_ADDRESS,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_ID,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  connectTimeout: 15_000,
});

const [[version]] = await connection.query('SELECT VERSION() AS V');

console.log(`# 대상 DB: ${process.env.DB_NAME}@${process.env.DB_ADDRESS}  (MySQL ${version.V})`);

const [tables] = await connection.query(
  `SELECT TABLE_NAME, ENGINE, TABLE_COLLATION, TABLE_COMMENT
     FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = ?
      AND (? = '' OR TABLE_NAME LIKE CONCAT(?, '%'))
    ORDER BY TABLE_NAME`,
  [process.env.DB_NAME, prefix, prefix],
);

if (tables.length === 0) {
  console.log(`조건에 맞는 테이블이 없습니다. (접두어: ${prefix || '(전체)'})`);
  await connection.end();
  process.exit(0);
}

console.log(`# 테이블 ${tables.length}개\n`);

for (const table of tables) {
  if (asDdl) {
    const [[ddl]] = await connection.query(`SHOW CREATE TABLE \`${table.TABLE_NAME}\``);
    console.log(ddl['Create Table'] + ';\n');
    continue;
  }

  const [[count]] = await connection.query(`SELECT COUNT(*) AS C FROM \`${table.TABLE_NAME}\``);
  const title = table.TABLE_COMMENT ? `${table.TABLE_NAME}  -- ${table.TABLE_COMMENT}` : table.TABLE_NAME;

  console.log(`## ${title}   [${table.ENGINE} / ${table.TABLE_COLLATION} / ${count.C}건]`);

  const [columns] = await connection.query(`SHOW FULL COLUMNS FROM \`${table.TABLE_NAME}\``);

  for (const column of columns) {
    const nullable = column.Null === 'NO' ? 'NOT NULL' : 'NULL';
    const extra = [column.Key, column.Extra].filter(Boolean).join(' ');

    console.log(
      `  - ${String(column.Field).padEnd(18)} ${String(column.Type).padEnd(22)} ${nullable.padEnd(8)}` +
        (extra ? ` ${extra}` : '') +
        (column.Comment ? `  // ${column.Comment}` : ''),
    );
  }

  console.log('');
}

await connection.end();
