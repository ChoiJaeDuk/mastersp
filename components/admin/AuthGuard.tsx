'use client';

/**
 * 메뉴별 권한 체크 (Client Component)
 *
 * osca 의 components/AuthGuard.js 와 같은 역할이다.
 * middleware 는 로그인 여부만 보고, 화면별 접근 권한은 여기서
 * TBL_SYS_AUTH_MENU 기준 메뉴 목록과 현재 경로를 대조해 판단한다.
 */
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useMenu } from '@/contexts/MenuContext';

/** 메뉴 권한과 무관하게 항상 열어두는 경로 */
const PUBLIC_ADMIN_PATHS = ['/admin'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { menus, ready } = useMenu();

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      setAllowed(true);
      return;
    }

    const hasMenu = menus.some((menu) => (menu.ROUTE ?? '').split('?')[0] === pathname);

    if (hasMenu) {
      setAllowed(true);
      return;
    }

    setAllowed(false);
    alert('해당 페이지에 접근 권한이 없습니다.\n관리자 홈으로 이동합니다.');
    router.replace('/admin');
  }, [ready, menus, pathname, router]);

  // 권한 확인 전에는 아무것도 그리지 않는다.
  if (!ready || !allowed) return null;

  return <>{children}</>;
}
