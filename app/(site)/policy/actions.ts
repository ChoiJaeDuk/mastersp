/**
 * 약관 조회 서버 액션
 *
 * 팝업(클라이언트 컴포넌트)이 열릴 때 본문을 가져온다.
 * 원본은 팝업 HTML 을 ajax 로 받아왔는데, 같은 흐름을 서버 액션으로 대체했다.
 */
'use server';

import { selectTermContent, TERM_KINDS, type TermSlug } from './data';

export async function getTermContent(slug: TermSlug): Promise<string | null> {
  if (!(slug in TERM_KINDS)) return null;

  return selectTermContent(slug);
}
