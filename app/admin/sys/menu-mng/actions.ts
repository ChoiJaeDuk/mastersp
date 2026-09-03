/**
 * 메뉴 관리 서버 액션
 * osca 의 app/sys/sys/menu-mng/actions.js 와 같은 CUD 처리다.
 */
'use server';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { emptyToNull, runGridSave, toNumberOrNull, toText } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import * as data from './data';
import { selectPgmList } from '../pgm-mng/data';

export async function getMenuList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectMenuList() as Promise<GridRow[]>;
}

/** 상위 메뉴 / 프로그램 드롭다운 데이터 */
export async function getMenuOptions() {
  await requireUserId();

  const [uppoMenus, programs] = await Promise.all([data.selectUppoMenuList(), selectPgmList()]);

  return {
    uppoMenus,
    programs: programs as { PGM_ID: string; PGM_NM: string }[],
  };
}

export async function saveMenuList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  return runGridSave(changes, userId, {
    async remove(client, row) {
      await client.query(SQL`DELETE FROM TBL_SYS_MENU WHERE MENU_ID = ${toText(row.MENU_ID)}`);
    },
    async update(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_SYS_MENU
           SET MENU_NM = ${toText(row.MENU_NM)},
               UPPO_MENU_ID = ${emptyToNull(row.UPPO_MENU_ID)},
               PGM_ID = ${emptyToNull(row.PGM_ID)},
               MENU_STEP = ${toText(row.MENU_STEP)},
               MENU_SEQO = ${toNumberOrNull(row.MENU_SEQO)},
               PARM_CTT = ${emptyToNull(row.PARM_CTT)},
               USE_YN = ${toText(row.USE_YN)},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE MENU_ID = ${toText(row.MENU_ID)}
      `);
    },
    async insert(client, row, changer) {
      await client.query(SQL`
        INSERT INTO TBL_SYS_MENU (
          MENU_ID, MENU_NM, UPPO_MENU_ID, PGM_ID, MENU_STEP, MENU_SEQO, PARM_CTT, USE_YN,
          FRST_REGR_EMPNO, LST_CHGR_EMPNO
        ) VALUES (
          ${toText(row.MENU_ID)},
          ${toText(row.MENU_NM)},
          ${emptyToNull(row.UPPO_MENU_ID)},
          ${emptyToNull(row.PGM_ID)},
          ${toText(row.MENU_STEP)},
          ${toNumberOrNull(row.MENU_SEQO)},
          ${emptyToNull(row.PARM_CTT)},
          ${toText(row.USE_YN)},
          ${changer},
          ${changer}
        )
      `);
    },
  });
}
