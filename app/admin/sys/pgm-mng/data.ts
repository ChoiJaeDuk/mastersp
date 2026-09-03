/**
 * 프로그램 관리 데이터 조회
 * osca 의 app/sys/sys/pgm-mng/data.js 와 같다.
 */
import { query, SQL } from '@/lib/db';

export async function selectPgmList() {
  try {
    return await query(SQL`
      SELECT PGM_ID, PGM_NM, PGM_PTH_NM
        FROM TBL_SYS_PGM
       ORDER BY PGM_ID
    `);
  } catch (error) {
    console.error('Failed to fetch selectPgmList :', error);
    return [];
  }
}
