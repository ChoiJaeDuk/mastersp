/**
 * 사용자 권한 관리 서버 액션
 *
 * 권한 컬럼(체크박스)의 값에 따라 TBL_SYS_USER_AUTH 를 넣고 뺀다.
 * (사용자 자체의 추가/삭제는 사용자 관리 화면에서 한다)
 */
'use server';

import { SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { runGridSave, toText } from '@/common/gridSave';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

import { selectUseAuthList } from '../auth-mng/data';
import * as data from './data';

/** 그리드에 필요한 권한 목록 + 피벗된 사용자 행 */
export async function getUserAuthList() {
  await requireUserId();

  const auths = await selectUseAuthList();
  const rows = await data.selectUserAuthList(auths.map((auth) => auth.AUTH_ID));

  return { auths, rows };
}

export async function saveUserAuthList(changes: GridChanges): Promise<GridSaveResult> {
  const sessionUserId = await requireUserId();
  const auths = await selectUseAuthList();

  return runGridSave(changes, sessionUserId, {
    async update(client, row, changer) {
      const userId = toText(row.USER_ID);

      for (const auth of auths) {
        if (row[auth.AUTH_ID] === true) {
          await client.query(SQL`
            INSERT INTO TBL_SYS_USER_AUTH (USER_ID, AUTH_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
            VALUES (${userId}, ${auth.AUTH_ID}, ${changer}, ${changer})
            ON CONFLICT (USER_ID, AUTH_ID) DO NOTHING
          `);
        } else {
          await client.query(SQL`
            DELETE FROM TBL_SYS_USER_AUTH
             WHERE USER_ID = ${userId} AND AUTH_ID = ${auth.AUTH_ID}
          `);
        }
      }
    },
  });
}
