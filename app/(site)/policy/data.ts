/**
 * 약관 / 개인정보처리방침 데이터 조회
 *
 * 레거시 운영 DB(masterspace_co_kr)의 tb_yark 를 직접 읽는다.
 *
 * 원본: kor/policy/privacy-text.html
 *   get_tb_other("mode='1'", "tb_yark", "uid")
 *   echo str_replace("'OOO'", "'".$SS['sitename']."'", stripslashes($content));
 *   mode 1 = 개인정보처리방침, 2 = 이용약관, 3 = 이메일무단수집거부
 */
import { isDbConfigured, queryOne, SQL } from '@/lib/db';

import { COMPANY_INFO } from '@/lib/navigation';

/** URL 세그먼트 → tb_yark.mode */
export const TERM_KINDS = {
  privacy: { mode: '1', label: '개인정보처리방침' },
  term: { mode: '2', label: '이용약관' },
  'email-security': { mode: '3', label: '이메일무단수집거부' },
} as const;

export type TermSlug = keyof typeof TERM_KINDS;

/**
 * 약관 본문 조회
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
    const row = await queryOne<{ content: string }>(SQL`
      SELECT content
        FROM tb_yark
       WHERE mode = ${TERM_KINDS[slug].mode}
       ORDER BY uid
       LIMIT 1
    `);

    if (!row?.content) return null;

    // 레거시는 출력할 때 stripslashes 를 거치고 'OOO' 를 사이트명으로 바꿔 넣는다.
    return row.content
      .replace(/\\(['"\\])/g, '$1')
      .replaceAll("'OOO'", `'${COMPANY_INFO.name}'`);
  } catch (error) {
    console.error('Failed to fetch selectTermContent :', error);
    return null;
  }
}
