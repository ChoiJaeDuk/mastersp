/**
 * 서버 세션 헬퍼
 *
 * osca 의 common/session.js 와 같은 역할이다.
 */
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

/** 로그인한 사용자 아이디 (미인증이면 null) */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  return session?.user?.id ?? null;
}

/** 로그인한 사용자의 권한 목록 */
export async function getUserRoles(): Promise<string[]> {
  const session = await getServerSession(authOptions);

  return session?.user?.roles ?? [];
}

/**
 * 서버 액션 진입 시 로그인 여부를 확인한다.
 *
 * @throws 미인증인 경우
 * @returns 로그인한 사용자 아이디
 */
export async function requireUserId(): Promise<string> {
  const userId = await getUserId();

  if (!userId) throw new Error('로그인이 필요합니다.');

  return userId;
}
