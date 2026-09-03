/**
 * 레거시 MySQL(회사홈페이지) → 신규 MySQL(mastersp) 데이터 마이그레이션
 *
 * 레거시는 조회만 하고, 결과를 INSERT 문(db/data.sql)으로 만든다.
 * --apply 를 주면 .env.local 의 DB_* (신규 DB) 로 접속해 바로 적용한다.
 *
 * 옮기는 대상 (국문 lantype='1' 만)
 *   tb_history                    -> TBL_HP_HISTORY
 *   tb_category(tablename=tb_project) -> TBL_HP_PROJECT_CTG
 *   tb_project                    -> TBL_HP_PROJECT
 *   tb_inquiry                    -> TBL_HP_INQUIRY
 *   tb_yark                       -> TBL_HP_TERM
 *
 * 사용법:
 *   node scripts/migrate-legacy.mjs           # db/data.sql 생성만
 *   node scripts/migrate-legacy.mjs --apply   # 생성 + 신규 MySQL 적용
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

/** .env.local 을 읽어 process.env 에 채운다. */
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

/** MySQL 문자열 리터럴 */
function lit(value) {
  if (value === null || value === undefined) return 'NULL';

  const text = String(value);

  // MySQL 은 백슬래시도 이스케이프 문자로 취급하므로 함께 처리한다.
  const escaped = text.replaceAll('\\', '\\\\').replaceAll("'", "''");

  return text === '' ? 'NULL' : `'${escaped}'`;
}

/** 'YYYY-MM-DD' 만 통과시킨다. (레거시 sdate/edate 는 varchar) */
function dateLit(value) {
  const text = String(value ?? '').slice(0, 10);

  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? `'${text}'` : 'NULL';
}

/** enum('Y','N') → 그대로. 값이 없으면 기본값 사용 */
function ynLit(value, fallback = 'Y') {
  const text = String(value ?? '').toUpperCase();

  return text === 'Y' || text === 'N' ? `'${text}'` : `'${fallback}'`;
}

/** 레거시 content 의 CRLF 를 LF 로 정리한다. (화면에서 줄 단위로 쪼갠다) */
function normalizeLines(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

loadEnv();

const apply = process.argv.includes('--apply');

const legacy = await mysql.createConnection({
  host: process.env.LEGACY_DB_HOST,
  port: Number(process.env.LEGACY_DB_PORT ?? 3306),
  user: process.env.LEGACY_DB_USER,
  password: process.env.LEGACY_DB_PASSWORD,
  database: process.env.LEGACY_DB_NAME,
  charset: 'utf8mb4',
  connectTimeout: 15_000,
});

const out = [];
const stats = {};

out.push('-- =====================================================================');
out.push('-- 레거시 MySQL(masterspace_co_kr) 에서 옮긴 실데이터  (대상: MySQL)');
out.push(`-- 생성 : ${new Date().toISOString()}  (scripts/migrate-legacy.mjs)`);
out.push('-- 국문(lantype=1) 데이터만 옮긴다. 다시 실행하려면 아래 DELETE 부터 수행된다.');
out.push('-- =====================================================================');
out.push('');
out.push('SET NAMES utf8mb4;');
out.push('SET FOREIGN_KEY_CHECKS = 0;');
out.push('START TRANSACTION;');
out.push('');
out.push('-- 재실행 대비 초기화 (참조 순서대로)');
out.push('DELETE FROM TBL_HP_PROJECT;');
out.push('DELETE FROM TBL_HP_PROJECT_CTG;');
out.push('DELETE FROM TBL_HP_HISTORY;');
out.push('DELETE FROM TBL_HP_INQUIRY;');
out.push('DELETE FROM TBL_HP_TERM;');
out.push('');

/* ---------------- 연혁 ---------------- */
const [histories] = await legacy.query(
  `SELECT year, month, content, sortnum, viewtype
     FROM tb_history
    WHERE lantype = '1'
    ORDER BY year DESC, month DESC, sortnum`,
);

out.push('-- 연혁 (tb_history)');
for (const row of histories) {
  out.push(
    'INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (' +
      `${lit(row.year)}, ${lit(String(row.month).padStart(2, '0'))}, ${lit(row.content)}, ` +
      `${Number(row.sortnum) || 999}, ${ynLit(row.viewtype)}, 'migration');`,
  );
}
stats.history = histories.length;
out.push('');

/* ---------------- 수행과제 분류 ---------------- */
const [categories] = await legacy.query(
  `SELECT cateno, catename, sortnum, viewtype
     FROM tb_category
    WHERE tablename = 'tb_project' AND lantype = '1'
    ORDER BY catename DESC`,
);

out.push('-- 수행과제 분류 (tb_category) — 레거시 cateno 를 CTG_SQNO 로 그대로 쓴다');
for (const row of categories) {
  out.push(
    'INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (' +
      `${Number(row.cateno)}, ${lit(row.catename)}, ${Number(row.sortnum) || 999}, ` +
      `${ynLit(row.viewtype)}, 'migration');`,
  );
}
stats.category = categories.length;
// AUTO_INCREMENT 를 옮긴 최대값 다음으로 맞춘다.
out.push('-- (AUTO_INCREMENT 재설정은 아래 COMMIT 뒤에서 수행한다)');
out.push('');

/* ---------------- 수행과제 ---------------- */
const validCategories = new Set(categories.map((row) => Number(row.cateno)));

const [projects] = await legacy.query(
  `SELECT mode, depth1, title, content, sdate, edate, field_etc_01, sortnum, viewtype
     FROM tb_project
    WHERE lantype = '1'
    ORDER BY mode, uid`,
);

out.push('-- 수행과제 (tb_project)');
let orphanCount = 0;

for (const row of projects) {
  // MyISAM 이라 외래키가 없어 depth1 이 사라진 분류를 가리킬 수 있다. 그런 행은 분류 없음으로 넣는다.
  const categoryId = validCategories.has(Number(row.depth1)) ? Number(row.depth1) : null;

  if (categoryId === null) orphanCount += 1;

  out.push(
    'INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (' +
      `${lit(row.mode === '2' ? '2' : '1')}, ${categoryId ?? 'NULL'}, ${lit(row.title)}, ` +
      `${lit(normalizeLines(row.content))}, ${dateLit(row.sdate)}, ${dateLit(row.edate)}, ` +
      `${lit(row.field_etc_01)}, ${Number(row.sortnum) || 999}, ${ynLit(row.viewtype)}, 'migration');`,
  );
}
stats.project = projects.length;
stats.projectOrphan = orphanCount;
out.push('');

/* ---------------- 고객문의 ---------------- */
const [inquiries] = await legacy.query(
  `SELECT title, field_etc_01, field_etc_02, uname, utel, uemail, content, content1, reply_date, reg_date
     FROM tb_inquiry
    ORDER BY uid`,
);

out.push('-- 고객문의 (tb_inquiry)');
for (const row of inquiries) {
  const registeredAt = row.reg_date ? row.reg_date.toISOString() : null;
  const replied = String(row.content1 ?? '').trim() !== '';

  out.push(
    'INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES (' +
      `${lit(row.title || '문의')}, ${lit(row.field_etc_01)}, ${lit(row.field_etc_02)}, ` +
      `${lit(row.uname || '-')}, ${lit(row.utel || '-')}, ${lit(row.uemail || '-')}, ` +
      // 레거시 폼에는 문의내용 입력란이 없어 대부분 비어 있다.
      `${lit(normalizeLines(row.content) || '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)')}, ` +
      `${registeredAt ? lit(registeredAt) : 'NOW()'}, ${replied ? "'DONE'" : "'RECV'"}, ` +
      `${lit(row.content1)}, ${replied && row.reply_date ? lit(row.reply_date) : 'NULL'}, ` +
      `${registeredAt ? lit(registeredAt) : 'NOW()'}, 'migration');`,
  );
}
stats.inquiry = inquiries.length;
out.push('');

/* ---------------- 약관 ---------------- */
const TERM_KIND = { 1: 'PRIVACY', 2: 'SERVICE', 3: 'EMAIL' };
const [terms] = await legacy.query('SELECT mode, content FROM tb_yark ORDER BY mode');

out.push('-- 약관 (tb_yark : 1=개인정보처리방침, 2=이용약관, 3=이메일무단수집거부)');
for (const row of terms) {
  const kind = TERM_KIND[Number(row.mode)];

  if (!kind) continue;

  // 레거시는 본문의 'OOO' 를 사이트명으로 치환해서 출력한다.
  const content = String(row.content ?? '').replace(/'OOO'/g, "'(주)장인의공간'");

  out.push(
    'INSERT INTO TBL_HP_TERM (TERM_KND_CD, TERM_CTT, USE_YN, LST_CHGR_EMPNO) VALUES (' +
      `${lit(kind)}, ${lit(content)}, 'Y', 'migration');`,
  );
}
stats.term = terms.length;
out.push('');
out.push('COMMIT;');
out.push('SET FOREIGN_KEY_CHECKS = 1;');
out.push('');
out.push('-- 분류 AUTO_INCREMENT 를 옮긴 최대값 다음으로 맞춘다.');
out.push(
  `ALTER TABLE TBL_HP_PROJECT_CTG AUTO_INCREMENT = ${
    Math.max(0, ...categories.map((row) => Number(row.cateno))) + 1
  };`,
);
out.push('');

await legacy.end();

const target = path.join('db', 'data.sql');
fs.mkdirSync('db', { recursive: true });
fs.writeFileSync(target, out.join('\n'), 'utf8');

console.log('# 레거시 → 신규 MySQL 변환 완료');
console.log(`  연혁          ${stats.history}건`);
console.log(`  수행과제 분류 ${stats.category}건`);
console.log(`  수행과제      ${stats.project}건  (분류 없음 ${stats.projectOrphan}건)`);
console.log(`  고객문의      ${stats.inquiry}건`);
console.log(`  약관          ${stats.term}건`);
console.log(`\n-> ${target}`);

if (!apply) {
  console.log('\n적용하려면 : node scripts/migrate-legacy.mjs --apply  (또는 mysql < db/data.sql)');
  process.exit(0);
}

/* ---------------- 신규 MySQL 적용 ---------------- */
if (!process.env.DB_ADDRESS || !process.env.DB_ID || !process.env.DB_NAME) {
  console.error('\n.env.local 의 DB_ADDRESS / DB_ID / DB_NAME 이 비어 있어 적용을 건너뜁니다.');
  process.exit(1);
}

const { default: pg } = await import('pg');

const client = new pg.Client({
  host: process.env.DB_ADDRESS,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_ID,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

await client.connect();
await client.query(fs.readFileSync(target, 'utf8'));
await client.end();

console.log('\nPostgreSQL 에 적용했습니다.');
