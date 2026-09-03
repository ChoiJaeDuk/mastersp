/**
 * 사용자 관리 서버 액션
 *
 * 비밀번호는 bcrypt 로 해시해서 저장한다.
 *  - 신규 행 : USER_PWD 필수
 *  - 수정 행 : USER_PWD 가 비어 있으면 기존 비밀번호를 유지한다
 */
'use server';

import bcrypt from 'bcryptjs';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { emptyToNull, runGridSave, toText } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import * as data from './data';

const BCRYPT_ROUNDS = 10;

export async function getUserList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectUserList() as Promise<GridRow[]>;
}

export async function saveUserList(changes: GridChanges): Promise<GridSaveResult> {
  const sessionUserId = await requireUserId();

  // 신규 행은 비밀번호가 반드시 있어야 한다.
  for (const row of changes.newRows) {
    if (toText(row.USER_PWD) === '') {
      return { success: false, message: `신규 사용자 '${toText(row.USER_ID)}' 의 비밀번호를 입력해 주세요.` };
    }
  }

  // 자기 계정을 스스로 삭제하지 못하게 막는다.
  if (changes.deletedRows.some((row) => toText(row.USER_ID) === sessionUserId)) {
    return { success: false, message: '현재 로그인한 계정은 삭제할 수 없습니다.' };
  }

  return runGridSave(changes, sessionUserId, {
    async remove(client, row) {
      await client.query(SQL`DELETE FROM TBL_SYS_USER WHERE USER_ID = ${toText(row.USER_ID)}`);
    },
    async update(client, row, changer) {
      const password = toText(row.USER_PWD);
      const approved = toText(row.APR_YN) === 'Y';

      await client.query(SQL`
        UPDATE TBL_SYS_USER
           SET USER_NM = ${toText(row.USER_NM)},
               USER_EML = ${emptyToNull(row.USER_EML)},
               USE_YN = ${toText(row.USE_YN)},
               APR_YN = ${toText(row.APR_YN)},
               APR_ID = ${approved ? changer : null},
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE USER_ID = ${toText(row.USER_ID)}
      `);

      // 비밀번호는 값이 입력된 경우에만 재설정한다.
      if (password !== '') {
        await client.query(SQL`
          UPDATE TBL_SYS_USER
             SET USER_PWD = ${await bcrypt.hash(password, BCRYPT_ROUNDS)}
           WHERE USER_ID = ${toText(row.USER_ID)}
        `);
      }
    },
    async insert(client, row, changer) {
      const approved = toText(row.APR_YN) === 'Y';

      await client.query(SQL`
        INSERT INTO TBL_SYS_USER (
          USER_ID, USER_NM, USER_PWD, USER_EML, USE_YN, APR_YN, APR_ID,
          FRST_REGR_EMPNO, LST_CHGR_EMPNO
        ) VALUES (
          ${toText(row.USER_ID)},
          ${toText(row.USER_NM)},
          ${await bcrypt.hash(toText(row.USER_PWD), BCRYPT_ROUNDS)},
          ${emptyToNull(row.USER_EML)},
          ${toText(row.USE_YN)},
          ${toText(row.APR_YN)},
          ${approved ? changer : null},
          ${changer},
          ${changer}
        )
      `);
    },
  });
}
