/**
 * PostgreSQL 스키마 조사 스크립트
 *
 * .env.local 의 접속 정보로 DB 에 붙어 테이블/컬럼/제약/인덱스를 덤프한다.
 * 실제 운영 DB 의 구조와 db/schema.sql 을 대조할 때 사용한다.
 *
 * 사용법:
 *   node scripts/inspect-db.mjs                 # 전체 테이블
 *   node scripts/inspect-db.mjs TBL_SYS_        # 접두어로 필터
 *   node scripts/inspect-db.mjs TBL_SYS_ --ddl  # CREATE TABLE 형태로 출력
 */
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

/** .env.local 을 읽어 process.env 에 채운다. (dotenv 의존성 없이 처리) */
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.error('.env.local 이 없습니다. .env.example 을 복사해서 값을 채워 주세요.');
    process.exit(1);
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const matched = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

    if (!matched) continue;

    const [, key, rawValue] = matched;
    process.env[key] = rawValue.replace(/^["'](.*)["']$/, '$1');
  }
}

loadEnv();

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '';
const asDdl = process.argv.includes('--ddl');

const client = new pg.Client({
  host: process.env.DB_ADDRESS,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_ID,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/** 컬럼 타입을 SQL 표기로 되돌린다. */
function formatType(col) {
  if (col.data_type === 'character varying') {
    return col.character_maximum_length ? `VARCHAR(${col.character_maximum_length})` : 'VARCHAR';
  }
  if (col.data_type === 'character') {
    return `CHAR(${col.character_maximum_length})`;
  }
  if (col.data_type === 'numeric' && col.numeric_precision != null) {
    return `NUMERIC(${col.numeric_precision},${col.numeric_scale})`;
  }
  return col.data_type.toUpperCase();
}

await client.connect();

const { rows: tables } = await client.query(
  `SELECT c.relname AS table_name,
          obj_description(c.oid) AS table_comment
     FROM pg_class c
     JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'r'
      AND n.nspname = 'public'
      AND ($1 = '' OR upper(c.relname) LIKE upper($1) || '%')
    ORDER BY c.relname`,
  [prefix],
);

if (tables.length === 0) {
  console.log(`조건에 맞는 테이블이 없습니다. (접두어: ${prefix || '(전체)'})`);
  await client.end();
  process.exit(0);
}

console.log(`# 대상 DB: ${process.env.DB_NAME}@${process.env.DB_ADDRESS}`);
console.log(`# 테이블 ${tables.length}개\n`);

for (const table of tables) {
  const { rows: columns } = await client.query(
    `SELECT column_name, data_type, character_maximum_length,
            numeric_precision, numeric_scale, is_nullable, column_default
       FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position`,
    [table.table_name],
  );

  const { rows: constraints } = await client.query(
    `SELECT conname, pg_get_constraintdef(oid) AS definition
       FROM pg_constraint
      WHERE conrelid = $1::regclass
      ORDER BY contype, conname`,
    [`public.${table.table_name}`],
  );

  const { rows: indexes } = await client.query(
    `SELECT indexdef FROM pg_indexes WHERE schemaname = 'public' AND tablename = $1`,
    [table.table_name],
  );

  const title = table.table_comment
    ? `${table.table_name.toUpperCase()}  -- ${table.table_comment}`
    : table.table_name.toUpperCase();

  if (asDdl) {
    console.log(`CREATE TABLE ${title}`);
    console.log('(');
    console.log(
      columns
        .map((col) => {
          const nullable = col.is_nullable === 'NO' ? ' NOT NULL' : '';
          const initial = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          return `  ${col.column_name.toUpperCase().padEnd(20)} ${formatType(col)}${nullable}${initial}`;
        })
        .join(',\n'),
    );
    constraints.forEach((c) => console.log(`  , CONSTRAINT ${c.conname} ${c.definition}`));
    console.log(');\n');
  } else {
    console.log(`## ${title}`);
    columns.forEach((col) => {
      const nullable = col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL';
      const initial = col.column_default ? ` default=${col.column_default}` : '';
      console.log(`  - ${col.column_name.toUpperCase().padEnd(20)} ${formatType(col).padEnd(16)} ${nullable}${initial}`);
    });
    constraints.forEach((c) => console.log(`  * ${c.conname}: ${c.definition}`));
    indexes.forEach((i) => console.log(`  # ${i.indexdef}`));
    console.log('');
  }
}

await client.end();
