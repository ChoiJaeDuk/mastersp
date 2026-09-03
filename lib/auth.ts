/**
 * next-auth 설정 (관리자 인증)
 *
 * osca 는 route.js 안에 두지만, Next.js 는 route 파일에서 핸들러 외의 export 를 허용하지 않아
 * 설정만 이 파일로 분리했다. 구성 자체는 osca 와 동일하다.
 *  - Credentials 방식 (아이디 / 비밀번호)
 *  - TBL_SYS_USER 에서 사용여부(USE_YN) · 승인여부(APR_YN) 가 'Y' 인 계정만 로그인
 *  - 비밀번호는 bcrypt 해시 비교
 *  - 로그인 성공 시 TBL_SYS_USER_HST 에 접속 이력을 남긴다
 */
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { DbNotConfiguredError, execute, query, SQL } from '@/lib/db';

type UserRow = {
  USER_ID: string;
  USER_NM: string;
  USER_PWD: string;
  AUTH_ID: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        userId: { label: '아이디', type: 'text' },
        userPwd: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.userId || !credentials?.userPwd) return null;

        try {
          // 권한을 여러 개 가질 수 있으므로 모두 읽어 배열로 넘긴다.
          const rows = await query<UserRow>(SQL`
            SELECT A.USER_ID,
                   A.USER_NM,
                   A.USER_PWD,
                   B.AUTH_ID
              FROM TBL_SYS_USER A
              LEFT JOIN TBL_SYS_USER_AUTH B ON A.USER_ID = B.USER_ID
             WHERE A.USER_ID = ${credentials.userId}
               AND A.USE_YN = 'Y'
               AND A.APR_YN = 'Y'
          `);

          const user = rows[0];

          if (!user) {
            console.log(`[Auth Failed] User not found : ${credentials.userId}`);
            return null;
          }

          if (!(await bcrypt.compare(credentials.userPwd, user.USER_PWD))) {
            console.log(`[Auth Failed] Invalid password : ${credentials.userId}`);
            return null;
          }

          return {
            id: user.USER_ID,
            name: user.USER_NM,
            roles: rows.map((row) => row.AUTH_ID).filter((id): id is string => Boolean(id)),
          };
        } catch (error) {
          console.error('[Auth Error]', error);

          // 접속 정보가 없으면 원인을 화면에 그대로 알려준다. (초기 세팅 단계에서 자주 만난다)
          if (error instanceof DbNotConfiguredError) {
            throw new Error('데이터베이스에 연결되어 있지 않습니다. .env.local 의 DB 접속 정보를 확인해 주세요.');
          }

          throw new Error('로그인 처리 중 오류가 발생했습니다.');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8시간
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.roles = user.roles;

        // 접속 이력 (실패해도 로그인은 진행한다)
        try {
          await execute(SQL`
            INSERT INTO TBL_SYS_USER_HST (USER_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
            VALUES (${user.id}, 'system', 'system')
          `);
        } catch (error) {
          console.error('Failed to insert TBL_SYS_USER_HST :', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.name = token.name ?? '';
        session.user.roles = token.roles ?? [];
      }

      return session;
    },
  },
};
