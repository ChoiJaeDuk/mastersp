/**
 * 공통 서버 액션 (메뉴 / 권한)
 *
 * osca 의 common/actions.js 와 같은 자리다.
 */
'use server';

import { getUserId } from './session';
import * as data from './data';
import type { MenuRow } from './data';

/**
 * 로그인한 사용자가 접근 가능한 메뉴 전체 조회
 *
 * 사이드 메뉴와 AuthGuard 가 함께 사용한다.
 */
export async function getMenuContents(): Promise<MenuRow[]> {
  const userId = await getUserId();

  if (!userId) return [];

  return data.selectMenuContents(userId);
}
