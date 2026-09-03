/**
 * 사용자 관리 데이터 조회
 *
 * osca 는 SELECT A.* 로 비밀번호 해시까지 화면으로 내려보내지만,
 * 여기서는 USER_PWD 를 조회 대상에서 제외한다. (해시를 클라이언트로 보내지 않는다)
 */
import { query, SQL } from '@/lib/db';

export async function selectUserList() {
  try {
    return await query(SQL`
      SELECT A.USER_ID,
             A.USER_NM,
             A.USER_EML,
             A.USE_YN,
             A.APR_YN,
             A.APR_ID,
             (SELECT X.USER_NM FROM TBL_SYS_USER X WHERE X.USER_ID = A.APR_ID) AS APR_NM,
             DATE_FORMAT(A.FRST_REG_DT, '%Y-%m-%d %H:%i') AS FRST_REG_DT,
             '' AS USER_PWD
        FROM TBL_SYS_USER A
       ORDER BY A.USER_ID
    `);
  } catch (error) {
    console.error('Failed to fetch selectUserList :', error);
    return [];
  }
}
