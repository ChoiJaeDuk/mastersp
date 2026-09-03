/**
 * 권한 관리 데이터 조회
 * osca 의 app/sys/sys/auth-mng/data.js 와 같다.
 */
import { query, SQL } from '@/lib/db';

export async function selectAuthList() {
  try {
    return await query(SQL`
      SELECT AUTH_ID, AUTH_NM, USE_YN
        FROM TBL_SYS_AUTH
       ORDER BY AUTH_ID
    `);
  } catch (error) {
    console.error('Failed to fetch selectAuthList :', error);
    return [];
  }
}

/** 사용 중인 권한만 조회 (드롭다운 / 권한별 메뉴 화면에서 사용) */
export async function selectUseAuthList() {
  try {
    return await query<{ AUTH_ID: string; AUTH_NM: string }>(SQL`
      SELECT AUTH_ID, AUTH_NM
        FROM TBL_SYS_AUTH
       WHERE USE_YN = 'Y'
       ORDER BY AUTH_ID
    `);
  } catch (error) {
    console.error('Failed to fetch selectUseAuthList :', error);
    return [];
  }
}
