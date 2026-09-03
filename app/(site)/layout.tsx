/**
 * 공개 사이트 레이아웃 (Server Component)
 * 원본: https://www.masterspace.co.kr/kor/main/main.html
 */
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

// 원본 사이트의 서브페이지 CSS. 관리자 화면에는 적용되지 않도록 이 레이아웃에서만 불러온다.
import '@/styles/legacy-common.css';
import '@/styles/legacy-sub.css';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
    </>
  );
}
