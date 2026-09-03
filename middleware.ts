/**
 * 인증 미들웨어
 *
 * osca 의 middleware.js 와 동일한 방식이다.
 *  - /admin/* 은 로그인 필수
 *  - 로그인 상태에서 /login 접근 시 /admin 으로 보낸다
 * 메뉴별 세부 권한은 AuthGuard(클라이언트)에서 확인한다.
 */
import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname === '/login') {
    if (token) return NextResponse.redirect(new URL('/admin', req.url));

    return NextResponse.next();
  }

  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
