/**
 * 그리드 저장(CUD) 공통 처리
 *
 * osca 의 각 화면 saveXxxList 액션이 반복하던
 * "커넥션 획득 → 트랜잭션 시작 → 삭제/수정/추가 → 커밋 / 롤백 → 반환" 흐름을 한 곳에 모았다.
 * 실제 SQL 은 화면마다 다르므로 콜백으로 받는다. (테이블명을 문자열로 조립하지 않는다)
 */
import type { PoolClient } from 'pg';

import { withTransaction } from '@/lib/db';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';

type RowHandler = (client: PoolClient, row: GridRow, userId: string) => Promise<void>;

export type GridSaveHandlers = {
  insert?: RowHandler;
  update?: RowHandler;
  remove?: RowHandler;
};

/**
 * 변경 묶음을 하나의 트랜잭션으로 반영한다.
 *
 * 삭제 → 수정 → 추가 순서로 처리한다. (osca 와 동일)
 *
 * @param changes  그리드가 넘긴 변경 묶음
 * @param userId   변경자 (감사 컬럼에 기록)
 * @param handlers 행 단위 처리 콜백
 */
export async function runGridSave(
  changes: GridChanges,
  userId: string,
  handlers: GridSaveHandlers,
): Promise<GridSaveResult> {
  const { newRows = [], updatedRows = [], deletedRows = [] } = changes;

  try {
    await withTransaction(async (client) => {
      if (handlers.remove) {
        for (const row of deletedRows) await handlers.remove(client, row, userId);
      }

      if (handlers.update) {
        for (const row of updatedRows) await handlers.update(client, row, userId);
      }

      if (handlers.insert) {
        for (const row of newRows) await handlers.insert(client, row, userId);
      }
    });

    return {
      success: true,
      created: newRows.length,
      updated: updatedRows.length,
      deleted: deletedRows.length,
    };
  } catch (error) {
    console.error('Grid save failed :', error);

    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}

/** 그리드 셀의 빈 문자열을 null 로 바꾼다. (숫자/외래키 컬럼용) */
export function emptyToNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();

  return text === '' ? null : text;
}

/** 그리드 셀을 숫자로 바꾼다. 비어 있으면 null. */
export function toNumberOrNull(value: unknown): number | null {
  const text = emptyToNull(value);

  if (text === null) return null;

  const parsed = Number(text);

  return Number.isNaN(parsed) ? null : parsed;
}

/** 그리드 셀을 문자열로 바꾼다. */
export function toText(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).trim();
}
