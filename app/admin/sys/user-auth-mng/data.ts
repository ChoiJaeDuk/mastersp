/**
 * 사용자 권한 관리 데이터 조회
 *
 * osca 와 동일하게 "사용자 한 명 = 한 행, 권한 하나 = 한 컬럼" 형태로 피벗해서 내려준다.
 * (권한이 늘어나면 컬럼이 늘어난다)
 */
import { query, SQL } from '@/lib/db';

export type UserAuthRow = {
  USER_ID: string;
  USER_NM: string;
  /** 권한 아이디를 필드명으로 갖는 체크 값 */
  [authId: string]: string | boolean;
};

/** 사용자 목록 + 보유 권한을 피벗한 결과 */
export async function selectUserAuthList(authIds: string[]): Promise<UserAuthRow[]> {
  try {
    const rows = await query<{ USER_ID: string; USER_NM: string; AUTH_ID: string | null }>(SQL`
      SELECT A.USER_ID,
             A.USER_NM,
             B.AUTH_ID
        FROM TBL_SYS_USER A
        LEFT JOIN TBL_SYS_USER_AUTH B ON A.USER_ID = B.USER_ID
       ORDER BY A.USER_ID
    `);

    const pivoted = new Map<string, UserAuthRow>();

    for (const row of rows) {
      let user = pivoted.get(row.USER_ID);

      if (!user) {
        user = { USER_ID: row.USER_ID, USER_NM: row.USER_NM };
        for (const authId of authIds) user[authId] = false;
        pivoted.set(row.USER_ID, user);
      }

      if (row.AUTH_ID && authIds.includes(row.AUTH_ID)) user[row.AUTH_ID] = true;
    }

    return [...pivoted.values()];
  } catch (error) {
    console.error('Failed to fetch selectUserAuthList :', error);
    return [];
  }
}
