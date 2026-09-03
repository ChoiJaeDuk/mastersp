/**
 * 권한별 메뉴 관리 서버 액션
 */
'use server';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { runGridSave, toText } from '@/common/gridSave';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import { selectUseAuthList } from '../auth-mng/data';
import * as data from './data';

/** 사용 중인 권한 목록 */
export async function getUseAuthList() {
  await requireUserId();

  return selectUseAuthList();
}

/** 선택한 권한의 메뉴 부여 현황 */
export async function getAuthMenuList(authId: string) {
  await requireUserId();

  return data.selectAuthMenuList(authId);
}

/**
 * 권한별 메뉴 저장
 *
 * @param changes 그리드 변경 묶음 (체크박스 수정만 발생한다)
 * @param authId  대상 권한
 */
export async function saveAuthMenuList(
  changes: GridChanges,
  authId: string,
): Promise<GridSaveResult> {
  const sessionUserId = await requireUserId();

  if (!authId) return { success: false, message: '권한을 먼저 선택해 주세요.' };

  return runGridSave(changes, sessionUserId, {
    async update(client, row, changer) {
      const menuId = toText(row.MENU_ID);

      if (row.AUTH_CHK === true) {
        await client.query(SQL`
          INSERT INTO TBL_SYS_AUTH_MENU (AUTH_ID, MENU_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
          VALUES (${authId}, ${menuId}, ${changer}, ${changer})
          ON CONFLICT (AUTH_ID, MENU_ID) DO NOTHING
        `);
      } else {
        await client.query(SQL`
          DELETE FROM TBL_SYS_AUTH_MENU WHERE AUTH_ID = ${authId} AND MENU_ID = ${menuId}
        `);
      }
    },
  });
}
