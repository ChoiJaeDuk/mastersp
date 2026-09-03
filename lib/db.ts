/**
 * 데이터베이스 접속 (MySQL)
 *
 * osca 프로젝트의 lib/db.js 와 동일한 컨벤션을 따른다.
 *  - global 싱글턴 커넥션 풀 (dev 의 HMR 로 인한 too many connection 방지)
 *  - SQL 태그드 템플릿(sql-template-strings)으로 쿼리 작성 → 파라미터 자동 바인딩
 *
 * 대상 서버는 레거시와 동일한 MySQL 5.6 이므로 아래를 쓰지 않는다.
 *  - CTE(WITH ...)        : 8.0 부터 지원
 *  - CHECK 제약           : 8.0.16 부터 실제로 강제됨 → ENUM 으로 대체
 *  - 윈도우 함수          : 8.0 부터 지원
 * 트랜잭션이 필요하므로 테이블은 모두 InnoDB 로 만든다. (레거시는 MyISAM)
 *
 * DB 미연결 모드
 *  - .env.local 의 DB_ADDRESS / DB_ID / DB_NAME 가 비어 있으면 커넥션 풀을 아예 만들지 않고
 *    쿼리 호출 시 DbNotConfiguredError 를 즉시 던진다. (접속 타임아웃까지 기다리지 않는다)
 *  - 호출부는 이 오류를 잡아 화면이 뜨는 데 지장이 없도록 처리한다.
 */
import mysql, {
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
} from 'mysql2/promise';
import type { SQLStatement } from 'sql-template-strings';

export { default as SQL } from 'sql-template-strings';

export type DbConnection = PoolConnection;

declare global {
  var __mastersp_mysql_pool__: Pool | undefined;
}

/**
 * DB 접속 정보가 채워져 있는지 확인한다.
 *
 * 셋 중 하나라도 비어 있으면 DB 미연결 모드로 본다.
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
 * @throws DbNotConfiguredError DB 미연결 모드인 경우
 */
export function getPool(): Pool {
  if (!isDbConfigured()) throw new DbNotConfiguredError();

  if (!global.__mastersp_mysql_pool__) {
    global.__mastersp_mysql_pool__ = mysql.createPool({
      host: process.env.DB_ADDRESS,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_ID,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // 레거시가 utf8 / utf8mb4 를 섞어 쓰므로 넓은 쪽으로 통일한다.
      charset: 'utf8mb4',
      connectionLimit: 20,
      waitForConnections: true,
      connectTimeout: 10_000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
      // DATE / DATETIME 을 Date 객체로 바꾸면 타임존만큼 밀리므로 문자열로 받는다.
      dateStrings: ['DATE'],
    });
  }

  return global.__mastersp_mysql_pool__;
}

/**
 * 조회 실행
 *
 * MySQL 은 컬럼명을 선언한 대로 돌려주므로(PostgreSQL 처럼 소문자로 접지 않는다)
 * SQL 을 대문자로 쓰면 결과 키도 대문자 그대로다.
 *
 * @param statement SQL 태그드 템플릿
 * @param client    트랜잭션 중이면 해당 커넥션 (없으면 풀에서 획득)
 */
export async function query<T = Record<string, unknown>>(
  statement: SQLStatement,
  client?: DbConnection,
): Promise<T[]> {
  const executor = client ?? getPool();
  const [rows] = await executor.query<RowDataPacket[]>(statement);

  return rows as T[];
}

/**
 * 단건 조회
 *
 * @returns 첫 번째 행, 없으면 null
 */
export async function queryOne<T = Record<string, unknown>>(
  statement: SQLStatement,
  client?: DbConnection,
): Promise<T | null> {
  const rows = await query<T>(statement, client);

  return rows[0] ?? null;
}

/**
 * INSERT / UPDATE / DELETE 실행
 *
 * @returns 영향받은 행 수와 AUTO_INCREMENT 로 만들어진 키
 */
export async function execute(
  statement: SQLStatement,
  client?: DbConnection,
): Promise<{ affectedRows: number; insertId: number }> {
  const executor = client ?? getPool();
  const [result] = await executor.query<ResultSetHeader>(statement);

  return { affectedRows: result.affectedRows, insertId: result.insertId };
}

/**
 * 트랜잭션 실행
 *
 * osca 의 getConnection() → beginTransaction() → commit() / rollback() → release() 흐름을
 * 하나의 헬퍼로 감싼 것이다. 콜백이 예외를 던지면 자동으로 롤백된다.
 *
 * @example
 * await withTransaction(async (conn) => {
 *   await conn.query(SQL`DELETE FROM TBL_SYS_MENU WHERE MENU_ID = ${id}`);
 * });
 */
export async function withTransaction<T>(
  fn: (client: DbConnection) => Promise<T>,
): Promise<T> {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();

    const result = await fn(connection);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
