/**
 * 프로젝트 쿼리 ↔ 스키마 정합성 검사
 *
 * db/schema.sql 을 파싱해 테이블/컬럼 목록을 만들고,
 * 프로젝트의 SQL 태그드 템플릿에서 참조하는 테이블과 컬럼이 실제로 있는지 대조한다.
 * DB 가 없어도 돌기 때문에 CI 나 스키마 변경 직후 회귀 검사로 쓸 수 있다.
 *
 * 사용법: node scripts/check-schema.mjs
 * 종료코드: 문제가 있으면 1
 */
import fs from 'node:fs';
import path from 'node:path';

/* ------------------------------------------------------------------ */
/* 1. db/schema.sql 파싱                                               */
/* ------------------------------------------------------------------ */

const schemaSql = fs.readFileSync(path.join('db', 'schema.sql'), 'utf8');

/** 테이블명(대문자) → 컬럼명 Set */
const schema = new Map();

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

    // 이 쿼리가 건드리는 테이블
    const tables = [...sql.matchAll(/\b(TBL_[A-Z0-9_]+)\b/g)].map((m) => m[1]);

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
      for (const column of schema.get(table) ?? []) known.add(column);
    }

    // 별칭.컬럼 형태와 단독 컬럼을 모두 본다. (문자열 리터럴은 제외)
    const withoutLiterals = sql.replace(/'[^']*'/g, "''");

    for (const token of new Set(
      [...withoutLiterals.matchAll(/\b([A-Z][A-Z0-9_]{2,})\b/g)].map((m) => m[1]),
    )) {
      if (IGNORED.has(token) || isAlias(token) || token.startsWith('TBL_')) continue;
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

console.log(`# 스키마 : 테이블 ${schema.size}개`);
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
