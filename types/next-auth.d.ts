/**
 * next-auth 타입 확장
 *
 * 세션/토큰에 사용자 아이디와 권한 목록(TBL_SYS_USER_AUTH.AUTH_ID)을 담는다.
 */
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    /** 보유 권한 목록 */
    roles: string[];
  }

  interface Session {
    user: {
      id: string;
      name: string;
      roles: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    roles: string[];
  }
}
