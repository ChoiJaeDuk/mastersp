/**
 * 권한별 메뉴 관리 데이터 조회
 * osca 의 app/sys/sys/auth-menu-mng/data.js 와 같다.
 *
 * 권한 하나를 고르면 3단계 메뉴 전체와 그 권한의 부여 여부를 함께 내려준다.
 */
import { query, SQL } from '@/lib/db';

export type AuthMenuRow = {
  MENU_ID: string;
  MENU_NM: string;
  MENU1_NM: string;
  MENU2_NM: string;
  PGM_PTH_NM: string | null;
  /** 권한 부여 여부 */
  AUTH_CHK: boolean;
};

export async function selectAuthMenuList(authId: string): Promise<AuthMenuRow[]> {
  try {
    // MySQL 의 불리언 표현식은 1/0 을 돌려주므로 화면에서 쓰기 전에 boolean 으로 바꾼다.
    const rows = await query<Omit<AuthMenuRow, 'AUTH_CHK'> & { AUTH_CHK: number }>(SQL`
      SELECT M3.MENU_ID,
             M3.MENU_NM,
             M1.MENU_NM AS MENU1_NM,
             M2.MENU_NM AS MENU2_NM,
             P.PGM_PTH_NM,
             (AM.MENU_ID IS NOT NULL) AS AUTH_CHK
        FROM TBL_SYS_MENU M3
        LEFT JOIN TBL_SYS_MENU M2 ON M3.UPPO_MENU_ID = M2.MENU_ID
        LEFT JOIN TBL_SYS_MENU M1 ON M2.UPPO_MENU_ID = M1.MENU_ID
        LEFT JOIN TBL_SYS_PGM P ON M3.PGM_ID = P.PGM_ID
        LEFT JOIN TBL_SYS_AUTH_MENU AM
               ON AM.MENU_ID = M3.MENU_ID AND AM.AUTH_ID = ${authId}
       WHERE M3.MENU_STEP = '3'
       ORDER BY M1.MENU_SEQO, M2.MENU_SEQO, M3.MENU_SEQO
    `);

    return rows.map((row) => ({ ...row, AUTH_CHK: Boolean(row.AUTH_CHK) }));
  } catch (error) {
    console.error('Failed to fetch selectAuthMenuList :', error);
    return [];
  }
}
