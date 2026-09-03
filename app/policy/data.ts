/**
 * 약관 / 개인정보처리방침 데이터 조회
 *
 * 레거시: kor/policy/privacy-text.html 의 get_tb_other("mode='1'", "tb_yark", "uid")
 *   mode 1 = 개인정보처리방침, 2 = 이용약관, 3 = 이메일무단수집거부
 */
import { queryOne, SQL } from '@/lib/db';

/** URL 세그먼트 → TBL_HP_TERM.TERM_KND_CD 매핑 */
export const TERM_KINDS = {
  privacy: { code: 'PRIVACY', label: '개인정보처리방침', labelEn: 'Privacy' },
  'email-security': { code: 'EMAIL', label: '이메일무단수집거부', labelEn: 'Email' },
  terms: { code: 'SERVICE', label: '이용약관', labelEn: 'Terms' },
} as const;

export type TermSlug = keyof typeof TERM_KINDS;

/**
 * 시행 중인 약관 본문 조회
 *
 * @returns 본문 HTML, 없으면 null
 */
export async function selectTermContent(slug: TermSlug): Promise<string | null> {
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
