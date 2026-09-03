'use client';

/**
 * 관리자 로그인 페이지
 * osca 의 app/login/page.js 와 같은 구성이다. (Credentials + redirect:false)
 */
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';

  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setPending(true);

    try {
      // redirect:false 로 결과를 직접 받아 실패 사유를 화면에 표시한다.
      const result = await signIn('credentials', { userId, userPwd, redirect: false });

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      // 자격 증명 불일치는 'CredentialsSignin', 그 외에는 authorize 가 던진 오류 메시지가 온다.
      setMessage(
        !result?.error || result.error === 'CredentialsSignin'
          ? '아이디 또는 비밀번호가 일치하지 않거나, 승인 대기중인 계정입니다.'
          : result.error,
      );
    } finally {
      setPending(false);
    }
  };

  const inputClass =
    'w-full border border-[#ddd] bg-white px-4 py-3 text-[0.9375rem] text-ink outline-none ' +
    'transition-colors placeholder:text-[#aaa] focus:border-brand';

  return (
    <main id="contents" className="flex min-h-screen items-center justify-center bg-[#f7f8fa] p-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-display text-xl font-black text-ink">MASTER&apos;S SPACE</p>
          <p className="mt-1 text-sm text-shell">홈페이지 관리자</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <label htmlFor="userId" className="sr-only">
              아이디
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              autoComplete="username"
              placeholder="아이디"
              required
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className={inputClass}
            />

            <label htmlFor="userPwd" className="sr-only">
              비밀번호
            </label>
            <input
              id="userPwd"
              name="userPwd"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              required
              value={userPwd}
              onChange={(event) => setUserPwd(event.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full bg-ink py-3 text-[0.9375rem] font-semibold text-white
                       transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? '로그인 중…' : '로그인'}
          </button>

          <p role="status" aria-live="polite" className="mt-4 min-h-5 text-center text-sm text-brand">
            {message}
          </p>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
