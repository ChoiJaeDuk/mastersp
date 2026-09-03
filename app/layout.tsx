/**
 * 전체 레이아웃 (Server Component)
 * 원본: https://www.masterspace.co.kr/kor/main/main.html
 */
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { COMPANY_INFO } from '@/lib/navigation';

import './globals.css';

/** 영문 디스플레이 서체 (원본 Manrope) */
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: COMPANY_INFO.name,
  description: '(주)장인의공간 - 전력시장 분석 시뮬레이터와 에너지 IT 솔루션 전문 기업',
  keywords: ['장인의공간', '전력시장', 'M-CORE', '전력거래시스템', '에너지 IT'],
  authors: [{ name: COMPANY_INFO.name }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: COMPANY_INFO.name,
    siteName: COMPANY_INFO.name,
    description: '(주)장인의공간 - 전력시장 분석 시뮬레이터와 에너지 IT 솔루션 전문 기업',
    url: 'https://www.masterspace.co.kr',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={manrope.variable}>
      <head>
        {/* 국문 본문 서체 (원본 Pretendard) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <ul>
          <li>
            <a className="skip-link" href="#contents">
              본문내용 바로가기
            </a>
          </li>
          <li>
            <a className="skip-link" href="#header">
              헤더 바로가기
            </a>
          </li>
          <li>
            <a className="skip-link" href="#footer">
              푸터 바로가기
            </a>
          </li>
        </ul>

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
