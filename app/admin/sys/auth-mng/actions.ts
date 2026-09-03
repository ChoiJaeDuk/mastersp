/**
 * 권한 관리 서버 액션
 */
'use server';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { runGridSave, toText } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import * as data from './data';

export async function getAuthList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectAuthList() as Promise<GridRow[]>;
}

/** 사용 중인 권한 목록 (다른 화면의 드롭다운용) */
export async function getUseAuthList() {
  await requireUserId();

  return data.selectUseAuthList();
}

export async function saveAuthList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  return runGridSave(changes, userId, {
    async remove(client, row) {
      await client.query(SQL`DELETE FROM TBL_SYS_AUTH WHERE AUTH_ID = ${toText(row.AUTH_ID)}`);
    },
    async update(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_SYS_AUTH
           SET AUTH_NM = ${toText(row.AUTH_NM)},
               USE_YN = ${toText(row.USE_YN)},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE AUTH_ID = ${toText(row.AUTH_ID)}
      `);
    },
    async insert(client, row, changer) {
      await client.query(SQL`
        INSERT INTO TBL_SYS_AUTH (AUTH_ID, AUTH_NM, USE_YN, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
        VALUES (${toText(row.AUTH_ID)}, ${toText(row.AUTH_NM)}, ${toText(row.USE_YN)}, ${changer}, ${changer})
      `);
    },
  });
}
