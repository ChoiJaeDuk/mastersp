/**
 * 관리자 레이아웃 (Server Component)
 *
 * osca 의 app/layout.js 구성(MainWrapper > Header > Container > AuthGuard)을 옮긴 것이다.
 * 로그인 여부는 middleware.ts 가, 화면별 권한은 AuthGuard 가 확인한다.
 */
import type { Metadata } from 'next';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSideMenu from '@/components/admin/AdminSideMenu';
import AuthGuard from '@/components/admin/AuthGuard';
import ContentTitle from '@/components/admin/ContentTitle';
import { MenuProvider } from '@/contexts/MenuContext';

import '@/styles/ag-grid.css';

export const metadata: Metadata = {
  title: '관리자 | (주)장인의공간',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      <div className="min-h-screen bg-[#f7f8fa]">
        <AdminHeader />

        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <AdminSideMenu />

          <main id="contents" className="min-w-0 flex-1 p-6">
            <ContentTitle />
            <AuthGuard>{children}</AuthGuard>
          </main>
        </div>
      </div>
    </MenuProvider>
  );
}
