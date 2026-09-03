'use client';

/**
 * 관리자 메뉴 컨텍스트
 *
 * osca 의 contexts/MenuContext.js 와 같은 역할이다.
 * 로그인 사용자가 접근 가능한 메뉴를 한 번만 조회해서
 * 사이드 메뉴 · 권한 체크(AuthGuard) · 본문 제목(ContentTitle)이 함께 쓴다.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

import { getMenuContents } from '@/common/actions';
import type { MenuRow } from '@/common/data';

/** 사이드 메뉴 트리 */
export type MenuTree = {
  id: string;
  name: string;
  children: {
    id: string;
    name: string;
    children: { id: string; name: string; route: string }[];
  }[];
};

type MenuContextValue = {
  menus: MenuRow[];
  tree: MenuTree[];
  /** 최초 조회가 끝났는지 */
  ready: boolean;
};

const MenuContext = createContext<MenuContextValue>({ menus: [], tree: [], ready: false });

/** 평평한 메뉴 목록을 3단 트리로 만든다. */
function buildTree(menus: MenuRow[]): MenuTree[] {
  const tree: MenuTree[] = [];

  for (const menu of menus) {
    let level1 = tree.find((node) => node.id === menu.MENU1_ID);

    if (!level1) {
      level1 = { id: menu.MENU1_ID, name: menu.MENU1_NM, children: [] };
      tree.push(level1);
    }

    let level2 = level1.children.find((node) => node.id === menu.MENU2_ID);

    if (!level2) {
      level2 = { id: menu.MENU2_ID, name: menu.MENU2_NM, children: [] };
      level1.children.push(level2);
    }

    level2.children.push({
      id: menu.MENU3_ID,
      name: menu.MENU3_NM,
      route: menu.ROUTE ?? '#',
    });
  }

  return tree;
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [menus, setMenus] = useState<MenuRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;

    getMenuContents()
      .then((rows) => {
        if (!cancelled) setMenus(rows);
      })
      .catch((error) => console.error('Failed to fetch menu :', error))
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const value = useMemo(() => ({ menus, tree: buildTree(menus), ready }), [menus, ready]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  return useContext(MenuContext);
}

/** 현재 경로에 해당하는 메뉴(대>중>소)를 찾는다. */
export function useMenuPath(pathname: string) {
  const { menus } = useMenu();

  return menus.find((menu) => (menu.ROUTE ?? '').split('?')[0] === pathname) ?? null;
}
