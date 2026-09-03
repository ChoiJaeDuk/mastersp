/**
 * 약관 / 개인정보처리방침 데이터 조회
 *
 * 레거시: kor/policy/privacy-text.html 의 get_tb_other("mode='1'", "tb_yark", "uid")
 *   mode 1 = 개인정보처리방침, 2 = 이용약관, 3 = 이메일무단수집거부
 */
import { isDbConfigured, queryOne, SQL } from '@/lib/db';

/** URL 세그먼트 → TBL_HP_TERM.TERM_KND_CD 매핑 */
export const TERM_KINDS = {
  privacy: { code: 'PRIVACY', label: '개인정보처리방침' },
  term: { code: 'SERVICE', label: '이용약관' },
  'email-security': { code: 'EMAIL', label: '이메일무단수집거부' },
} as const;

export type TermSlug = keyof typeof TERM_KINDS;

/**
 * 시행 중인 약관 본문 조회
 *
 * DB 미연결 모드에서는 조회를 건너뛰고 null 을 돌려준다.
 * 페이지는 "등록된 내용이 없습니다." 를 그리므로 화면 확인에는 지장이 없다.
 *
 * @returns 본문 HTML, 없으면 null
 */
export async function selectTermContent(slug: TermSlug): Promise<string | null> {
  if (!isDbConfigured()) {
    console.warn(`[policy] DB 미연결 모드 - 약관 본문 조회를 건너뜁니다 : ${slug}`);
    return null;
  }

  try {
    const row = await queryOne<{ TERM_CTT: string }>(SQL`
      SELECT TERM_CTT
        FROM TBL_HP_TERM
       WHERE TERM_KND_CD = ${TERM_KINDS[slug].code}
         AND USE_YN = 'Y'
         AND APLY_BGNG_DT <= NOW()
       ORDER BY APLY_BGNG_DT DESC
       LIMIT 1
    `);

    return row?.TERM_CTT ?? null;
  } catch (error) {
    console.error('Failed to fetch selectTermContent :', error);
    return null;
  }
}
