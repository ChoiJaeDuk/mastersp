'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type SubNavItem = {
  label: string;
  href: string;
};

/**
 * 서브페이지 상단 고정 네비게이션 (원본 .fix-nav)
 *
 * 앵커(#) 링크와 페이지 링크를 모두 받는다.
 * 페이지 링크인 경우 현재 경로와 일치하면 활성 표시한다.
 */
export default function SubNav({ items }: { items: SubNavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-white/95 backdrop-blur">
      <div className="site-container">
        <ul className="-mx-1 flex items-center gap-1 overflow-x-auto py-2">
          {items.map((item) => {
            const isActive = !item.href.startsWith('#') && pathname === item.href;

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  data-active={isActive}
                  className="block px-4 py-2 text-[0.9375rem] whitespace-nowrap text-shell
                             transition-colors hover:text-brand
                             data-[active=true]:font-semibold data-[active=true]:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
