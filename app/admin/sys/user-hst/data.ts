/**
 * 접속 이력 조회 데이터
 */
import { query, SQL } from '@/lib/db';

/** 최근 접속 이력 (기본 500건) */
export async function selectUserHstList(limit = 500) {
  try {
    return await query(SQL`
      SELECT H.HST_SQNO,
             H.USER_ID,
             U.USER_NM,
             H.CNN_IP,
             TO_CHAR(H.FRST_REG_DT, 'YYYY-MM-DD HH24:MI:SS') AS CNN_DT
        FROM TBL_SYS_USER_HST H
        LEFT JOIN TBL_SYS_USER U ON H.USER_ID = U.USER_ID
       ORDER BY H.FRST_REG_DT DESC
       LIMIT ${limit}
    `);
  } catch (error) {
    console.error('Failed to fetch selectUserHstList :', error);
    return [];
  }
}
