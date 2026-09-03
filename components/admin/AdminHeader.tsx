'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { COMPANY_INFO } from '@/lib/navigation';

/** 관리자 상단 바 (Client Component) */
export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#e5e5e5] bg-white px-5">
      <Link href="/admin" className="flex items-center gap-2">
        <span className="font-display text-base font-black text-ink">MASTER&apos;S SPACE</span>
        <span className="text-sm text-shell">관리자</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/" target="_blank" className="text-shell hover:text-brand">
          홈페이지 보기
        </Link>

        {session?.user ? (
          <>
            <span className="text-ink">
              <strong className="font-semibold">{session.user.name}</strong>
              {session.user.roles?.length ? (
                <span className="ml-1 text-shell">({session.user.roles.join(', ')})</span>
              ) : null}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="border border-[#ddd] px-3 py-1.5 text-shell hover:bg-[#f5f5f5]"
            >
              로그아웃
            </button>
          </>
        ) : null}
      </div>

      <span className="sr-only">{COMPANY_INFO.name} 관리자</span>
    </header>
  );
}
