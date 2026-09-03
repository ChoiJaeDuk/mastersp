/**
 * 프로그램 관리 서버 액션
 */
'use server';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { runGridSave, toText } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import * as data from './data';

export async function getPgmList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectPgmList() as Promise<GridRow[]>;
}

export async function savePgmList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  return runGridSave(changes, userId, {
    async remove(client, row) {
      await client.query(SQL`DELETE FROM TBL_SYS_PGM WHERE PGM_ID = ${toText(row.PGM_ID)}`);
    },
    async update(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_SYS_PGM
           SET PGM_NM = ${toText(row.PGM_NM)},
               PGM_PTH_NM = ${toText(row.PGM_PTH_NM)},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE PGM_ID = ${toText(row.PGM_ID)}
      `);
    },
    async insert(client, row, changer) {
      await client.query(SQL`
        INSERT INTO TBL_SYS_PGM (PGM_ID, PGM_NM, PGM_PTH_NM, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
        VALUES (${toText(row.PGM_ID)}, ${toText(row.PGM_NM)}, ${toText(row.PGM_PTH_NM)}, ${changer}, ${changer})
      `);
    },
  });
}
