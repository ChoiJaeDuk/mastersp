/**
 * next-auth 라우트 핸들러
 *
 * 설정(authOptions)은 lib/auth.ts 에 있다.
 * (Next.js 는 route 파일에서 핸들러 이외의 export 를 허용하지 않는다)
 */
import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
