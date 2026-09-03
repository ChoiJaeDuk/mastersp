/**
 * 연혁 관리 서버 액션
 *
 * 저장 후 공개 페이지(/company)의 캐시를 무효화한다.
 */
'use server';

import { revalidatePath } from 'next/cache';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { runGridSave, toNumberOrNull, toText } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import * as data from './data';

export async function getHistoryList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectHistoryList() as Promise<GridRow[]>;
}

export async function saveHistoryList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  const result = await runGridSave(changes, userId, {
    async remove(client, row) {
      await client.query(
        SQL`DELETE FROM TBL_HP_HISTORY WHERE HIST_SQNO = ${toNumberOrNull(row.HIST_SQNO)}`,
      );
    },
    async update(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_HP_HISTORY
           SET HIST_YR = ${toText(row.HIST_YR)},
               HIST_MM = ${toText(row.HIST_MM).padStart(2, '0')},
               HIST_CTT = ${toText(row.HIST_CTT)},
               MENU_SEQO = ${toNumberOrNull(row.MENU_SEQO) ?? 999},
               USE_YN = ${toText(row.USE_YN)},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE HIST_SQNO = ${toNumberOrNull(row.HIST_SQNO)}
      `);
    },
    async insert(client, row, changer) {
      await client.query(SQL`
        INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO)
        VALUES (
          ${toText(row.HIST_YR)},
          ${toText(row.HIST_MM).padStart(2, '0')},
          ${toText(row.HIST_CTT)},
          ${toNumberOrNull(row.MENU_SEQO) ?? 999},
          ${toText(row.USE_YN)},
          ${changer}
        )
      `);
    },
  });

  if (result.success) revalidatePath('/company');

  return result;
}
