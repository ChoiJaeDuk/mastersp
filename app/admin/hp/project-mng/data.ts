/**
 * 수행과제 관리 데이터 조회
 */
import { query, SQL } from '@/lib/db';

/** 수행과제 분류(연도) */
export async function selectProjectCtgList() {
  try {
    return await query(SQL`
      SELECT CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN
        FROM TBL_HP_PROJECT_CTG
       ORDER BY CTG_NM DESC
    `);
  } catch (error) {
    console.error('Failed to fetch selectProjectCtgList :', error);
    return [];
  }
}

/** 수행과제 */
export async function selectProjectList() {
  try {
    return await query(SQL`
      SELECT P.PRJ_SQNO,
             P.PRJ_KND_CD,
             P.CTG_SQNO,
             P.PRJ_NM,
             P.PRJ_CTT,
             P.BGNG_DE,
             P.END_DE,
             P.ORDR_NM,
             P.MENU_SEQO,
             P.USE_YN
        FROM TBL_HP_PROJECT P
        LEFT JOIN TBL_HP_PROJECT_CTG C ON P.CTG_SQNO = C.CTG_SQNO
       ORDER BY P.PRJ_KND_CD, C.CTG_NM DESC NULLS LAST, P.MENU_SEQO, P.PRJ_SQNO
    `);
  } catch (error) {
    console.error('Failed to fetch selectProjectList :', error);
    return [];
  }
}
