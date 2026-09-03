/**
 * 데이터베이스 접속 (PostgreSQL)
 *
 * osca 프로젝트의 lib/db.js 와 동일한 컨벤션을 따른다.
 *  - global 싱글턴 커넥션 풀 (dev 의 HMR 로 인한 too many connection 방지)
 *  - SQL 태그드 템플릿(sql-template-strings)으로 쿼리 작성 → 파라미터 자동 바인딩
 *
 * osca(MariaDB) 와의 차이점
 *  - PostgreSQL 은 따옴표 없는 식별자를 소문자로 접는다. 즉 `SELECT USER_ID ...` 의
 *    결과 키는 `user_id` 가 된다. osca 화면 코드가 `row.USER_ID` 를 그대로 쓰므로,
 *    query() 헬퍼가 결과 키를 대문자로 되돌려 준다. (raw 결과가 필요하면 getPool() 을 직접 사용)
 *  - 트랜잭션은 conn.beginTransaction() 대신 withTransaction() 헬퍼를 사용한다.
 *
 * DB 미연결 모드
 *  - .env.local 의 DB_ADDRESS / DB_ID / DB_NAME 가 비어 있으면 커넥션 풀을 아예 만들지 않고
 *    쿼리 호출 시 DbNotConfiguredError 를 즉시 던진다. (접속 타임아웃까지 기다리지 않는다)
 *  - 호출부는 이 오류를 잡아 화면이 뜨는 데 지장이 없도록 처리한다.
 *    DB 없이 퍼블리싱/화면만 확인하려는 개발 환경을 위한 장치다.
 */
import { Pool, types, type PoolClient, type QueryResultRow } from 'pg';
import type { SQLStatement } from 'sql-template-strings';

export { default as SQL } from 'sql-template-strings';

/** DATE(1082) 를 Date 객체로 바꾸면 타임존만큼 날짜가 밀리므로 'YYYY-MM-DD' 문자열로 유지한다. */
types.setTypeParser(types.builtins.DATE, (value) => value);
/** NUMERIC(1700) 은 기본이 문자열이라 숫자로 변환한다. */
types.setTypeParser(types.builtins.NUMERIC, (value) => Number(value));
/** INT8(20) 도 기본이 문자열이라 숫자로 변환한다. (COUNT(*) 등) */
types.setTypeParser(types.builtins.INT8, (value) => Number(value));

declare global {
  var __mastersp_pg_pool__: Pool | undefined;
}

/**
 * DB 접속 정보가 채워져 있는지 확인한다.
 *
 * 셋 중 하나라도 비어 있으면 DB 미연결 모드로 본다.
 * (pg 는 host 가 없으면 localhost 로 붙으려 하므로 명시적으로 걸러야 한다)
 */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DB_ADDRESS && process.env.DB_ID && process.env.DB_NAME);
}

/** DB 미연결 모드에서 쿼리를 호출했을 때 던지는 오류 */
export class DbNotConfiguredError extends Error {
  constructor() {
    super('DB 접속 정보(DB_ADDRESS / DB_ID / DB_NAME)가 설정되지 않았습니다.');
    this.name = 'DbNotConfiguredError';
  }
}

/**
 * 커넥션 풀 획득 (최초 호출 시 생성)
 *
 * raw 결과가 필요하면 이 풀을 직접 사용한다.
 *
 * @throws DbNotConfiguredError DB 미연결 모드인 경우
 */
export function getPool(): Pool {
  if (!isDbConfigured()) throw new DbNotConfiguredError();

  if (!global.__mastersp_pg_pool__) {
    global.__mastersp_pg_pool__ = new Pool({
      host: process.env.DB_ADDRESS,
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_ID,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 20, // 커넥션 상한
      idleTimeoutMillis: 60_000, // 유휴 커넥션 60초 후 정리
      connectionTimeoutMillis: 10_000, // 커넥션 획득 대기 최대 10초
      keepAlive: true,
    });

    // 유휴 커넥션에서 발생한 오류로 프로세스가 죽지 않도록 한다.
    global.__mastersp_pg_pool__.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client :', err);
    });
  }

  return global.__mastersp_pg_pool__;
}

/** 결과 행의 키를 대문자로 변환한다. (PostgreSQL 의 소문자 폴딩 보정) */
function toUpperKeys<T>(rows: QueryResultRow[]): T[] {
  return rows.map((row) => {
    const upper: Record<string, unknown> = {};
    for (const key of Object.keys(row)) {
      upper[key.toUpperCase()] = row[key];
    }
    return upper as T;
  });
}

/**
 * 조회 실행
 *
 * @param statement SQL 태그드 템플릿
 * @param client    트랜잭션 중이면 해당 커넥션 (없으면 풀에서 획득)
 * @returns 대문자 키로 변환된 결과 행 배열
 */
export async function query<T = Record<string, unknown>>(
  statement: SQLStatement,
  client?: PoolClient,
): Promise<T[]> {
  const executor = client ?? getPool();
  const result = await executor.query(statement);

  return toUpperKeys<T>(result.rows);
}

/**
 * 단건 조회
 *
 * @returns 첫 번째 행, 없으면 null
 */
export async function queryOne<T = Record<string, unknown>>(
  statement: SQLStatement,
  client?: PoolClient,
): Promise<T | null> {
  const rows = await query<T>(statement, client);

  return rows[0] ?? null;
}

/**
 * 트랜잭션 실행
 *
 * osca 의 getConnection() → beginTransaction() → commit() / rollback() → release() 흐름을
 * 하나의 헬퍼로 감싼 것이다. 콜백이 예외를 던지면 자동으로 롤백된다.
 *
 * @example
 * await withTransaction(async (client) => {
 *   await client.query(SQL`DELETE FROM TBL_SYS_MENU WHERE MENU_ID = ${id}`);
 * });
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    const result = await fn(client);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
