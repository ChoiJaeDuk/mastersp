import Image from 'next/image';
import Link from 'next/link';

import ScrollTopButton from '@/components/layout/ScrollTopButton';
import { COMPANY_INFO, NAV_ITEMS, POLICY_LINKS } from '@/lib/navigation';

/** 사이트 공통 푸터 (Server Component) */
export default function Footer() {
  return (
    <footer id="footer" className="relative bg-footer text-base xxl:text-[1.125rem]">
      <div className="site-container flex flex-col gap-10 py-20 xxl:flex-row xxl:gap-0 xxl:pt-[7.5rem] xxl:pb-[10.625rem]">
        {/* 로고 + 회사 정보 */}
        <div className="text-center xxl:w-[31.875rem] xxl:text-left">
          <Image
            src="/images/main/logo-w.png"
            alt={COMPANY_INFO.name}
            width={270}
            height={35}
            className="mx-auto h-auto w-[210px] xxl:mx-0 xxl:w-[270px]"
          />
          <div className="mt-8 space-y-1.5 text-[#999]">
            <p className="font-semibold text-white">{COMPANY_INFO.name}</p>
            <p>대표: {COMPANY_INFO.ceo}</p>
            <p>사업자등록번호: {COMPANY_INFO.bizNo}</p>
            <p>{COMPANY_INFO.email}</p>
          </div>
        </div>

        {/* 사이트맵 (1400px 이상에서만 노출) */}
        <nav aria-label="푸터 메뉴" className="hidden xxl:block xxl:w-[calc(100%-31.875rem)]">
          <ul className="flex justify-between">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="font-semibold text-[#ccc] transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
                <ul className="mt-10 space-y-2.5">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="font-light text-[#999] transition-colors hover:text-brand"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 하단 바 */}
      <div className="w-full bg-footer-deep py-5 xxl:h-[4.375rem] xxl:py-0">
        <div className="site-container flex h-full flex-col items-center justify-between gap-2.5 text-white md:flex-row md:gap-0">
          <ul className="flex items-center font-semibold text-[#ccc]">
            {POLICY_LINKS.map((link, index) => (
              <li
                key={link.href}
                className={
                  index === 0
                    ? 'pr-4'
                    : 'relative pl-4 before:absolute before:top-1/2 before:left-0 before:h-1/2 before:w-px before:-translate-y-1/2 before:bg-[#666]'
                }
              >
                <Link href={link.href} className="transition-colors hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#999]">{COMPANY_INFO.copyright}</p>
        </div>
      </div>

      <ScrollTopButton />
    </footer>
  );
}
