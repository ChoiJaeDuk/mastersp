'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMenu } from '@/contexts/MenuContext';

/**
 * 관리자 좌측 메뉴 (Client Component)
 *
 * 권한이 있는 메뉴만 TBL_SYS_AUTH_MENU 기준으로 조회해서 3단 트리로 그린다.
 */
export default function AdminSideMenu() {
  const pathname = usePathname();
  const { tree, ready } = useMenu();

  return (
    <nav aria-label="관리자 메뉴" className="w-56 shrink-0 border-r border-[#e5e5e5] bg-white">
      <div className="sticky top-0 max-h-screen overflow-y-auto px-3 py-6">
        {!ready ? (
          <p className="px-3 text-sm text-shell">메뉴를 불러오는 중…</p>
        ) : tree.length === 0 ? (
          <p className="px-3 text-sm text-shell">접근 가능한 메뉴가 없습니다.</p>
        ) : (
          <ul className="space-y-6">
            {tree.map((level1) => (
              <li key={level1.id}>
                <p className="px-3 text-xs font-bold tracking-wide text-brand">{level1.name}</p>

                <ul className="mt-2 space-y-4">
                  {level1.children.map((level2) => (
                    <li key={level2.id}>
                      <p className="px-3 text-[0.8125rem] font-semibold text-ink">{level2.name}</p>

                      <ul className="mt-1">
                        {level2.children.map((level3) => {
                          const isActive = pathname === level3.route.split('?')[0];

                          return (
                            <li key={level3.id}>
                              <Link
                                href={level3.route}
                                data-active={isActive}
                                className="block rounded px-3 py-1.5 text-[0.8125rem] text-shell
                                           transition-colors hover:bg-[#f5f5f5] hover:text-brand
                                           data-[active=true]:bg-[#fff4ec] data-[active=true]:font-semibold
                                           data-[active=true]:text-brand"
                              >
                                {level3.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
