/**
 * 루트 레이아웃 (Server Component)
 *
 * html / body / 전역 스타일 / 세션 프로바이더만 담당한다.
 * 공개 사이트의 헤더·푸터는 app/(site)/layout.tsx, 관리자 화면은 app/admin/layout.tsx 가 그린다.
 */
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import AuthSessionProvider from '@/components/providers/AuthSessionProvider';
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
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
