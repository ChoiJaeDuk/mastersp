/**
 * 공통 데이터 조회 (메뉴 / 권한)
 *
 * osca 의 common/data.js + app/api/menu/route.js 조회를 옮긴 것이다.
 * 대상이 MySQL 5.6 이라 CTE(WITH ...) 를 쓸 수 없어 IN 서브쿼리로 작성했다.
 * 문자열 연결도 MySQL 에서 `||` 는 OR 이므로 CONCAT() 을 쓴다.
 */
import { isDbConfigured, query, SQL } from '@/lib/db';

/** 3단 메뉴 한 줄 (대분류 > 중분류 > 화면) */
export type MenuRow = {
  MENU1_ID: string;
  MENU1_NM: string;
  MENU2_ID: string;
  MENU2_NM: string;
  MENU3_ID: string;
  MENU3_NM: string;
  MENU_ID: string;
  PGM_ID: string | null;
  /** 실제 이동 경로 (파라미터가 있으면 ?가 붙는다) */
  ROUTE: string | null;
};

/**
 * 사용자가 접근할 수 있는 메뉴 전체 조회
 *
 * 권한은 3단계 메뉴에 부여되므로 3단계를 기준으로 상위 메뉴를 끌어올린다.
 */
export async function selectMenuContents(userId: string): Promise<MenuRow[]> {
  if (!isDbConfigured()) {
    console.warn('[menu] DB 미연결 모드 - 메뉴 조회를 건너뜁니다.');
    return [];
  }

  try {
    return await query<MenuRow>(SQL`
      SELECT M1.MENU_ID  AS MENU1_ID,
             M1.MENU_NM  AS MENU1_NM,
             M2.MENU_ID  AS MENU2_ID,
             M2.MENU_NM  AS MENU2_NM,
             M3.MENU_ID  AS MENU3_ID,
             M3.MENU_NM  AS MENU3_NM,
             M3.MENU_ID  AS MENU_ID,
             P.PGM_ID,
             CASE WHEN COALESCE(M3.PARM_CTT, '') = '' THEN P.PGM_PTH_NM
                  ELSE CONCAT(P.PGM_PTH_NM, '?', M3.PARM_CTT)
             END AS ROUTE
        FROM TBL_SYS_MENU M3
        JOIN TBL_SYS_MENU M2 ON M3.UPPO_MENU_ID = M2.MENU_ID AND M2.USE_YN = 'Y'
        JOIN TBL_SYS_MENU M1 ON M2.UPPO_MENU_ID = M1.MENU_ID AND M1.USE_YN = 'Y'
        LEFT JOIN TBL_SYS_PGM P ON M3.PGM_ID = P.PGM_ID
       WHERE M3.USE_YN = 'Y'
         AND M3.MENU_STEP = '3'
         AND M3.MENU_ID IN (
               SELECT AM.MENU_ID
                 FROM TBL_SYS_AUTH_MENU AM
                 JOIN TBL_SYS_AUTH A ON AM.AUTH_ID = A.AUTH_ID AND A.USE_YN = 'Y'
                 JOIN TBL_SYS_USER_AUTH UA ON UA.AUTH_ID = AM.AUTH_ID
                WHERE UA.USER_ID = ${userId}
             )
       ORDER BY M1.MENU_SEQO, M2.MENU_SEQO, M3.MENU_SEQO
    `);
  } catch (error) {
    console.error('Failed to fetch selectMenuContents :', error);
    return [];
  }
}
