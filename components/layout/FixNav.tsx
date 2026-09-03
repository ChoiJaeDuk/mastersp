'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * 서브페이지 고정 네비게이션
 * 원본: 각 서브페이지의 <div class="fix-nav"><div class="sub-container"><ul class="sub-nav">
 *
 * 원본은 앵커 이동 시 nav_active 스크립트가 .active 를 붙이므로
 * 같은 동작을 IntersectionObserver 로 재구현했다. (앵커 링크인 경우)
 * 페이지 링크(제품소개)는 현재 경로로 판단한다.
 */
export type FixNavItem = {
  label: string;
  href: string;
};

export default function FixNav({
  items,
  /** 원본 .sub-nav 에 함께 붙는 변형 클래스 (pd-nav / en-pd-nav / companyNav) */
  variant = '',
}: {
  items: FixNavItem[];
  variant?: string;
}) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<string>('');

  const anchors = items.filter((item) => item.href.includes('#'));

  // 앵커 메뉴는 화면에 보이는 섹션을 따라 활성 표시를 옮긴다.
  useEffect(() => {
    if (anchors.length === 0) return;

    const ids = anchors.map((item) => item.href.split('#')[1]).filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) setActiveHash(visible.target.id);
      },
      // 헤더(100px) + fix-nav 높이를 감안해 상단을 잘라낸다.
      { rootMargin: '-160px 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
    // items 는 화면마다 고정이므로 최초 1회만 관찰한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (href: string) => {
    if (href.includes('#')) return href.split('#')[1] === activeHash;

    return pathname === href.split('#')[0];
  };

  return (
    <div className="fix-nav">
      <div className="sub-container">
        <ul className={`sub-nav${variant ? ` ${variant}` : ''}`}>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={isActive(item.href) ? 'active' : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
