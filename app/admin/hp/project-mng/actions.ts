/**
 * 수행과제 관리 서버 액션
 *
 * 분류(연도)와 과제를 각각 저장한다. 저장 후 공개 페이지(/project) 캐시를 무효화한다.
 */
'use server';

import { revalidatePath } from 'next/cache';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { emptyToNull, runGridSave, toNumberOrNull, toText } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import * as data from './data';

export async function getProjectCtgList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectProjectCtgList() as Promise<GridRow[]>;
}

export async function getProjectList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectProjectList() as Promise<GridRow[]>;
}

/** 분류(연도) 저장 */
export async function saveProjectCtgList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  const result = await runGridSave(changes, userId, {
    async remove(client, row) {
      await client.query(
        SQL`DELETE FROM TBL_HP_PROJECT_CTG WHERE CTG_SQNO = ${toNumberOrNull(row.CTG_SQNO)}`,
      );
    },
    async update(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_HP_PROJECT_CTG
           SET CTG_NM = ${toText(row.CTG_NM)},
               MENU_SEQO = ${toNumberOrNull(row.MENU_SEQO) ?? 999},
               USE_YN = ${toText(row.USE_YN)},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE CTG_SQNO = ${toNumberOrNull(row.CTG_SQNO)}
      `);
    },
    async insert(client, row, changer) {
      await client.query(SQL`
        INSERT INTO TBL_HP_PROJECT_CTG (CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO)
        VALUES (
          ${toText(row.CTG_NM)},
          ${toNumberOrNull(row.MENU_SEQO) ?? 999},
          ${toText(row.USE_YN)},
          ${changer}
        )
      `);
    },
  });

  if (result.success) revalidatePath('/project');

  return result;
}

/** 과제 저장 */
export async function saveProjectList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  const result = await runGridSave(changes, userId, {
    async remove(client, row) {
      await client.query(
        SQL`DELETE FROM TBL_HP_PROJECT WHERE PRJ_SQNO = ${toNumberOrNull(row.PRJ_SQNO)}`,
      );
    },
    async update(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_HP_PROJECT
           SET PRJ_KND_CD = ${toText(row.PRJ_KND_CD)},
               CTG_SQNO = ${toNumberOrNull(row.CTG_SQNO)},
               PRJ_NM = ${toText(row.PRJ_NM)},
               PRJ_CTT = ${emptyToNull(row.PRJ_CTT)},
               BGNG_DE = ${emptyToNull(row.BGNG_DE)},
               END_DE = ${emptyToNull(row.END_DE)},
               ORDR_NM = ${emptyToNull(row.ORDR_NM)},
               MENU_SEQO = ${toNumberOrNull(row.MENU_SEQO) ?? 999},
               USE_YN = ${toText(row.USE_YN)},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE PRJ_SQNO = ${toNumberOrNull(row.PRJ_SQNO)}
      `);
    },
    async insert(client, row, changer) {
      await client.query(SQL`
        INSERT INTO TBL_HP_PROJECT (
          PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN,
          LST_CHGR_EMPNO
        ) VALUES (
          ${toText(row.PRJ_KND_CD)},
          ${toNumberOrNull(row.CTG_SQNO)},
          ${toText(row.PRJ_NM)},
          ${emptyToNull(row.PRJ_CTT)},
          ${emptyToNull(row.BGNG_DE)},
          ${emptyToNull(row.END_DE)},
          ${emptyToNull(row.ORDR_NM)},
          ${toNumberOrNull(row.MENU_SEQO) ?? 999},
          ${toText(row.USE_YN)},
          ${changer}
        )
      `);
    },
  });

  if (result.success) revalidatePath('/project');

  return result;
}
