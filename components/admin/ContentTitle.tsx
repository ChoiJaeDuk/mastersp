'use client';

import { usePathname } from 'next/navigation';

import { useMenuPath } from '@/contexts/MenuContext';

/**
 * 본문 제목 + 경로 (Client Component)
 * osca 의 components/layout/ContentTitle.js 와 같은 역할이다.
 */
export default function ContentTitle() {
  const pathname = usePathname();
  const menu = useMenuPath(pathname);

  if (!menu) return null;

  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
      <h1 className="text-xl font-bold text-ink">{menu.MENU3_NM}</h1>
      <ol className="flex items-center gap-2 text-sm text-shell">
        <li>{menu.MENU1_NM}</li>
        <li aria-hidden>›</li>
        <li>{menu.MENU2_NM}</li>
        <li aria-hidden>›</li>
        <li className="text-ink">{menu.MENU3_NM}</li>
      </ol>
    </div>
  );
}
