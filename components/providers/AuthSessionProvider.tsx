'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * next-auth 세션 프로바이더
 *
 * 루트 레이아웃은 서버 컴포넌트라 클라이언트 프로바이더를 이 파일로 감싼다.
 */
export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
