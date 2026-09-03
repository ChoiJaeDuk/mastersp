/**
 * 메뉴 관리 데이터 조회
 * osca 의 app/sys/sys/menu-mng/data.js 와 같다.
 */
import { query, SQL } from '@/lib/db';

/** 전체 메뉴 조회 (단계 → 상위메뉴 → 순번) */
export async function selectMenuList() {
  try {
    return await query(SQL`
      SELECT M.MENU_ID,
             M.MENU_NM,
             M.UPPO_MENU_ID,
             M.PGM_ID,
             M.MENU_STEP,
             M.MENU_SEQO,
             M.PARM_CTT,
             M.USE_YN
        FROM TBL_SYS_MENU M
       ORDER BY M.MENU_STEP, M.UPPO_MENU_ID NULLS FIRST, M.MENU_SEQO
    `);
  } catch (error) {
    console.error('Failed to fetch selectMenuList :', error);
    return [];
  }
}

/** 상위 메뉴 선택용 (1·2단계 메뉴) */
export async function selectUppoMenuList() {
  try {
    return await query<{ MENU_ID: string; MENU_NM: string }>(SQL`
      SELECT MENU_ID, MENU_NM
        FROM TBL_SYS_MENU
       WHERE MENU_STEP IN ('1', '2')
       ORDER BY MENU_STEP, MENU_SEQO
    `);
  } catch (error) {
    console.error('Failed to fetch selectUppoMenuList :', error);
    return [];
  }
}
