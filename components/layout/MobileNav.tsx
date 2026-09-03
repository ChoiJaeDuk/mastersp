'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CloseIcon, GlobeIcon, MenuIcon } from '@/components/ui/Icons';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

type MobileNavProps = {
  /** 헤더가 어두운 상태(스크롤/호버)일 때 햄버거 아이콘 색을 흰색으로 */
  dark?: boolean;
};

/**
 * 모바일 GNB (1024px 미만).
 * 원본 .nav-mobile__btn + aside.nav-mobile 구조를 재현한다.
 */
export default function MobileNav({ dark = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // 드로어가 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* 언어 선택 + 햄버거 (모바일 전용) */}
      <div className="absolute top-1/2 right-5 flex -translate-y-1/2 items-center gap-2 lg:hidden">
        <a
          href={COMPANY_INFO.engSiteUrl}
          className="flex items-center gap-1 text-sm font-medium"
        >
          <GlobeIcon className="h-4 w-4" />
          <span>ENG</span>
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="전체 메뉴 열기"
          aria-expanded={open}
          className={`flex h-[60px] w-[60px] items-center justify-center ${
            dark ? 'text-white' : 'text-[#222]'
          }`}
        >
          <MenuIcon className="h-7 w-7" />
        </button>
      </div>

      {/* 딤 배경 */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        data-open={String(open)}
        className="drawer-dim fixed inset-0 z-[600] bg-black/50 lg:hidden"
      />

      {/* 드로어 */}
      <aside
        aria-hidden={!open}
        data-open={String(open)}
        className="drawer-panel fixed top-0 right-0 z-[700] h-full w-full max-w-[600px] bg-white text-left lg:hidden"
      >
        <div className="relative h-[60px] border-b border-[#ddd]">
          <div className="flex h-full items-center justify-start">
            <Link href="/" className="px-5" title="메인으로" onClick={() => setOpen(false)}>
              <Image
                src="/images/main/logo.png"
                alt={COMPANY_INFO.name}
                width={330}
                height={43}
                className="h-auto w-[150px]"
              />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="전체 메뉴 닫기"
            className="absolute top-0 right-0 flex h-[60px] w-[60px] items-center justify-center text-[#222]"
          >
            <CloseIcon className="h-7 w-7" />
          </button>
        </div>

        <nav className="h-[calc(100vh-60px)] overflow-y-auto pb-[50px]">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[#ddd] px-4 py-4 text-[1.2rem] text-black transition-colors hover:bg-brand hover:text-white"
                >
                  {item.label}
                </Link>
                {item.children.length > 1 && (
                  <ul className="bg-[whitesmoke]">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-[0.7rem] pr-4 pl-[1.6rem] text-base text-[#555] transition-colors hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
