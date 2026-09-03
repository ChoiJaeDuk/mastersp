'use client';

/**
 * 그리드 CRUD 공통 Hook
 *
 * osca 의 hooks/useGridHandler.js 와 같은 흐름이다.
 *  - 행 추가 / 행 삭제(취소선 토글) / 셀 수정 을 추적해서
 *  - '저장' 시 { newRows, updatedRows, deletedRows } 한 덩어리로 서버 액션에 넘긴다
 *
 * osca 대비 제외한 것: 드래그 범위 선택 · CSV Import · 엑셀 붙여넣기
 * (관리자 화면에서 쓰지 않아 넣지 않았다)
 */
import { useCallback, useMemo, useState } from 'react';
import type { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';

import { buildCompositeKey, flattenColumnDefs, type GridColumnDefs, type GridRow } from '@/common/gridFns';

/** 저장 시 서버 액션에 넘기는 변경 묶음 */
export type GridChanges = {
  newRows: GridRow[];
  updatedRows: GridRow[];
  deletedRows: GridRow[];
};

/** 서버 액션의 저장 결과 */
export type GridSaveResult = {
  success: boolean;
  created?: number;
  updated?: number;
  deleted?: number;
  message?: string;
};

type UseGridHandlerOptions = {
  columnDefs: GridColumnDefs;
  /** 저장 서버 액션 */
  saveAction: (changes: GridChanges) => Promise<GridSaveResult>;
  /** 조회(새로고침) 함수 */
  selectAction: () => Promise<void> | void;
  /** CSV 내보내기 파일명 */
  exportFileName?: string;
};

/**
 * 필수 입력 / 키 중복 검사
 *
 * @returns 통과하면 true
 */
function validateGridRows(rows: GridRow[], columns: ReturnType<typeof flattenColumnDefs>): boolean {
  for (const row of rows) {
    for (const column of columns) {
      if (column.isRequired !== true || !column.field) continue;

      const value = row[column.field];

      if (value === null || value === undefined || String(value).trim() === '') {
        const rowType = row.__isNew ? '신규' : '수정된';
        alert(`${rowType} 행의 '${column.headerName ?? column.field}' 항목은 필수 입력값입니다.`);
        return false;
      }
    }
  }

  const keyFields = columns
    .filter((column) => column.isKey === true)
    .map((column) => column.field)
    .filter((field): field is string => Boolean(field));

  if (keyFields.length > 0) {
    const seen = new Set<string>();

    for (const row of rows) {
      const key = buildCompositeKey(row, keyFields);

      if (key.split('_').some((part) => part === '')) continue;

      if (seen.has(key)) {
        alert(`키 값이 중복되었습니다 : ${key}`);
        return false;
      }

      seen.add(key);
    }
  }

  return true;
}

export function useGridHandler({
  columnDefs,
  saveAction,
  selectAction,
  exportFileName = 'export.csv',
}: UseGridHandlerOptions) {
  const [gridApi, setGridApi] = useState<GridApi<GridRow> | null>(null);
  const [loading, setLoading] = useState(false);

  /** 행 추가 개수 입력 팝업 */
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = useCallback(() => setIsPopupOpen(true), []);
  const closePopup = useCallback(() => setIsPopupOpen(false), []);

  // CUD 변경사항 추적
  const [newRows, setNewRows] = useState<GridRow[]>([]);
  const [updatedRows, setUpdatedRows] = useState<Record<string, GridRow>>({});
  const [deletedRows, setDeletedRows] = useState<GridRow[]>([]);

  const flatColumnDefs = useMemo(() => flattenColumnDefs(columnDefs), [columnDefs]);

  const keyFields = useMemo(
    () =>
      flatColumnDefs
        .filter((column) => column.isKey === true)
        .map((column) => column.field)
        .filter((field): field is string => Boolean(field)),
    [flatColumnDefs],
  );

  const hasChanges =
    newRows.length > 0 || Object.keys(updatedRows).length > 0 || deletedRows.length > 0;

  const resetChanges = useCallback(() => {
    setNewRows([]);
    setUpdatedRows({});
    setDeletedRows([]);
  }, []);

  const onGridReady = useCallback((event: GridReadyEvent<GridRow>) => {
    setGridApi(event.api);
  }, []);

  /** 조회(새로고침) */
  const handleSearch = useCallback(async () => {
    if (hasChanges && !confirm('저장되지 않은 변경사항이 있습니다. 계속 진행하시겠습니까?')) {
      return;
    }

    resetChanges();
    gridApi?.deselectAll();

    setLoading(true);
    try {
      await selectAction();
    } finally {
      setLoading(false);
    }
  }, [hasChanges, resetChanges, gridApi, selectAction]);

  /** 행 추가 */
  const handleAddRow = useCallback(
    (count: number) => {
      closePopup();

      if (!gridApi) return;

      const now = Date.now();

      const rowsToAdd: GridRow[] = Array.from({ length: count }, (_, index) => {
        const initial: GridRow = {};

        for (const column of flatColumnDefs) {
          if (!column.field) continue;

          initial[column.field] = column.defaultValue !== undefined ? column.defaultValue : '';
        }

        return {
          ...initial,
          __isNew: true,
          __isUpdated: false,
          __isDeleted: false,
          internalId: `temp_${now}_${index}`,
        };
      });

      setNewRows((prev) => [...prev, ...rowsToAdd]);
      gridApi.applyTransaction({ add: rowsToAdd });

      const lastIndex = gridApi.getDisplayedRowCount() - 1;
      gridApi.ensureIndexVisible(lastIndex);
      gridApi.getDisplayedRowAtIndex(lastIndex)?.setSelected(true);
    },
    [gridApi, flatColumnDefs, closePopup],
  );

  /**
   * 행 삭제
   *
   * 신규 행은 즉시 제거하고, 기존 행은 삭제 표시(취소선)를 토글한다.
   */
  const handleDeleteRows = useCallback(() => {
    if (!gridApi) return;

    const selectedNodes = gridApi.getSelectedNodes();

    if (selectedNodes.length === 0) {
      alert('삭제 또는 복원할 행을 선택해 주세요.');
      return;
    }

    const newRowsToRemove: GridRow[] = [];
    const existingRowsToUpdate: GridRow[] = [];
    const toMark: GridRow[] = [];
    const toUnmark: GridRow[] = [];

    for (const node of selectedNodes) {
      const data = node.data;

      if (!data) continue;

      if (data.__isNew) {
        newRowsToRemove.push(data);
        continue;
      }

      const wasMarked = data.__isDeleted === true;
      existingRowsToUpdate.push({ ...data, __isDeleted: !wasMarked });

      if (wasMarked) toUnmark.push(data);
      else toMark.push(data);
    }

    if (newRowsToRemove.length > 0) {
      gridApi.applyTransaction({ remove: newRowsToRemove });
      setNewRows((prev) =>
        prev.filter((row) => !newRowsToRemove.some((target) => target.internalId === row.internalId)),
      );
    }

    if (existingRowsToUpdate.length > 0) {
      gridApi.applyTransaction({ update: existingRowsToUpdate });

      setDeletedRows((prev) => {
        const isSameRow = (a: GridRow, b: GridRow) =>
          keyFields.length > 0 && keyFields.every((field) => a[field] === b[field]);

        const kept = prev.filter((row) => !toUnmark.some((target) => isSameRow(row, target)));

        return [...kept, ...toMark];
      });
    }

    gridApi.deselectAll();
  }, [gridApi, keyFields]);

  /** 셀 수정 추적 */
  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<GridRow>) => {
      const data = event.data;

      if (data.__isNew) {
        setNewRows((prev) =>
          prev.map((row) => (row.internalId === data.internalId ? { ...data } : row)),
        );
        return;
      }

      if (keyFields.length === 0) {
        console.error('onCellValueChanged: isKey 컬럼이 정의되지 않았습니다.');
        return;
      }

      data.__isUpdated = true;
      event.api.refreshCells({ rowNodes: [event.node], force: true });

      setUpdatedRows((prev) => ({ ...prev, [buildCompositeKey(data, keyFields)]: { ...data } }));
    },
    [keyFields],
  );

  /** 저장 */
  const handleSaveChanges = useCallback(async () => {
    if (!gridApi) {
      alert('그리드가 아직 준비되지 않았습니다.');
      return false;
    }

    if (keyFields.length === 0) {
      alert('그리드의 isKey 컬럼이 정의되지 않았습니다.');
      return false;
    }

    const finalNewRows = newRows.filter((row) => !row.__isDeleted);

    // 삭제 표시된 행은 수정 대상에서 제외한다.
    const finalUpdatedRows = Object.values(updatedRows).filter(
      (updated) =>
        !deletedRows.some((deleted) => keyFields.every((field) => updated[field] === deleted[field])),
    );

    if (!validateGridRows([...finalNewRows, ...finalUpdatedRows], flatColumnDefs)) return false;

    if (finalNewRows.length === 0 && finalUpdatedRows.length === 0 && deletedRows.length === 0) {
      alert('변경사항이 없습니다.');
      return false;
    }

    if (!confirm('변경사항을 저장하시겠습니까?')) return false;

    setLoading(true);
    try {
      const result = await saveAction({
        newRows: finalNewRows,
        updatedRows: finalUpdatedRows,
        deletedRows,
      });

      if (!result.success) {
        alert('오류가 발생했습니다 : ' + (result.message ?? '알 수 없는 오류'));
        return false;
      }

      alert(
        `처리가 완료되었습니다.\n- 신규: ${result.created ?? 0}건\n- 수정: ${result.updated ?? 0}건\n- 삭제: ${result.deleted ?? 0}건`,
      );

      resetChanges();
      await selectAction();

      return true;
    } finally {
      setLoading(false);
    }
  }, [
    gridApi,
    keyFields,
    newRows,
    updatedRows,
    deletedRows,
    flatColumnDefs,
    saveAction,
    resetChanges,
    selectAction,
  ]);

  /** CSV 내보내기 */
  const exportCsv = useCallback(() => {
    if (!gridApi) {
      alert('그리드가 아직 준비되지 않았습니다.');
      return;
    }

    gridApi.exportDataAsCsv({ fileName: exportFileName });
  }, [gridApi, exportFileName]);

  return {
    gridApi,
    loading,
    hasChanges,
    onGridReady,
    onCellValueChanged,
    handleSearch,
    handleAddRow,
    handleDeleteRows,
    handleSaveChanges,
    exportCsv,
    isPopupOpen,
    openPopup,
    closePopup,
  };
}

export type GridHandler = ReturnType<typeof useGridHandler>;
