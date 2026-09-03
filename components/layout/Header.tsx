'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import MobileNav from '@/components/layout/MobileNav';
import { GlobeIcon } from '@/components/ui/Icons';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

/**
 * 상단 고정 헤더 + 메가 드롭다운 GNB.
 * 호버/스크롤 상태에 따라 헤더 전체 배경과 로고가 바뀌므로
 * header 요소 자체가 클라이언트 컴포넌트여야 한다.
 */
export default function Header() {
  const [activeDrop, setActiveDrop] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dark = scrolled || activeDrop !== null;
  const activeItem = NAV_ITEMS.find((item) => item.id === activeDrop) ?? null;

  // 로고는 어두운 헤더에서 화이트 버전으로 교체된다. (원본 크기가 서로 달라 각각 지정)
  const logo = dark
    ? { src: '/images/main/logo-w.png', width: 270, height: 35 }
    : { src: '/images/main/logo.png', width: 330, height: 43 };

  return (
    <header
      id="header"
      onMouseLeave={() => setActiveDrop(null)}
      className={`fixed top-0 left-0 z-[500] w-full transition-colors duration-300 ${
        dark ? 'bg-shell text-white' : 'bg-white text-ink'
      }`}
    >
      <div className="site-container relative flex h-[60px] items-center lg:h-[100px] lg:gap-16 xxl:gap-40">
        <div className="shrink-0">
          <Link href="/" title="메인으로" className="inline-flex h-full items-center">
            <Image
              src={logo.src}
              alt={COMPANY_INFO.name}
              width={logo.width}
              height={logo.height}
              priority
              className="h-[26px] w-auto lg:h-[43px]"
            />
          </Link>
        </div>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden w-full items-center justify-between lg:flex">
          <nav aria-label="주 메뉴">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.id}
                  onMouseEnter={() => setActiveDrop(item.id)}
                  onFocus={() => setActiveDrop(item.id)}
                  className="relative flex h-[100px] items-center justify-center"
                >
                  <Link
                    href={item.href}
                    data-active={String(activeDrop === item.id)}
                    className="gnb-link mx-6 xxl:mx-10"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={COMPANY_INFO.engSiteUrl}
            className="flex items-center gap-2 font-medium transition-colors hover:text-brand"
          >
            <GlobeIcon className="h-[26px] w-[26px]" />
            <span>ENG</span>
          </a>
        </div>

        <MobileNav dark={dark} />
      </div>

      {/* 메가 드롭다운 */}
      <div
        data-open={String(activeItem !== null)}
        className="mega-panel absolute top-full left-0 hidden w-full border-t border-[#ddd] bg-shell lg:block"
      >
        {activeItem && (
          // key 를 주어 다른 메뉴로 옮길 때마다 fade-in-down 이 다시 재생되게 한다.
          <div key={activeItem.id} className="site-container">
            {/* 원본 .content-wrap : 늘이지 않고 통째로 가운데 정렬한다. */}
            <div className="flex w-full items-center justify-center py-[5.625rem]">
              {/* 원본 .img-bx : 설명(왼쪽) + 이미지(오른쪽) 가로 배치 */}
              <div className="mega-fade-in flex shrink-0 items-center gap-10">
                <p className="shrink-0 text-xl font-medium text-white">
                  {activeItem.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <Image
                  src={activeItem.image}
                  alt=""
                  width={422}
                  height={232}
                  className="h-auto w-[422px] shrink-0 rounded-[1em] brightness-110"
                />
              </div>

              {/* 원본 .text-bx : 이미지 오른쪽에 한 줄씩 나열 (margin-left 5.3125rem) */}
              <ul className="mega-fade-in mega-fade-in--delayed ml-[5.3125rem] shrink-0 space-y-2">
                {activeItem.children.map((child) => (
                  <li key={child.href} className="leading-tight">
                    <Link
                      href={child.href}
                      className="block text-lg text-[#ddd] transition-colors hover:text-brand"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
