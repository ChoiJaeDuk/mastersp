/**
 * 연혁 관리 데이터 조회
 */
import { query, SQL } from '@/lib/db';

export async function selectHistoryList() {
  try {
    return await query(SQL`
      SELECT HIST_SQNO, HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN
        FROM TBL_HP_HISTORY
       ORDER BY HIST_YR DESC, HIST_MM DESC, MENU_SEQO
    `);
  } catch (error) {
    console.error('Failed to fetch selectHistoryList :', error);
    return [];
  }
}
