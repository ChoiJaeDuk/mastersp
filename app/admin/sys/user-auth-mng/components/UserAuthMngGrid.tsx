'use client';

/**
 * 사용자 권한 관리 그리드
 *
 * osca 와 동일하게 사용자 한 명이 한 행, 권한 하나가 한 컬럼(체크박스)이다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getUserAuthList, saveUserAuthList } from '../actions';

export default function UserAuthMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();
  const [auths, setAuths] = useState<{ AUTH_ID: string; AUTH_NM: string }[]>([]);

  const selectUserAuthList = useCallback(async () => {
    const result = await getUserAuthList();

    setAuths(result.auths);
    setRowData(result.rows as unknown as GridRow[]);
  }, []);

  useEffect(() => {
    selectUserAuthList();
  }, [selectUserAuthList]);

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      { field: 'USER_ID', headerName: '사용자계정', isKey: true, editable: false, flex: 1 },
      { field: 'USER_NM', headerName: '사용자명', editable: false, flex: 1 },
      // 권한 하나당 체크박스 컬럼 하나
      ...auths.map((auth) => ({
        field: auth.AUTH_ID,
        headerName: auth.AUTH_NM,
        editable: true,
        cellDataType: 'boolean' as const,
        width: 160,
      })),
    ],
    [auths],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: saveUserAuthList,
    selectAction: selectUserAuthList,
  });

  const getRowId = useMemo(() => createGridRowIdFunction(columnDefs), [columnDefs]);

  return (
    <section className="bg-white p-4 shadow-sm">
      {/* 사용자 자체의 등록/삭제는 사용자 관리 화면에서 한다 */}
      <GridToolbar gridHandler={gridHandler} editable={false}>
        <button
          type="button"
          onClick={gridHandler.handleSaveChanges}
          disabled={gridHandler.loading}
          className="bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-opacity
                     hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          저장
        </button>
      </GridToolbar>

      <CommonGrid
        gridHandler={gridHandler}
        rowData={rowData}
        columnDefs={columnDefs}
        getRowId={getRowId}
        theme={commonTheme}
      />
      <p className="mt-3 text-xs text-shell">
        체크된 권한이 해당 사용자에게 부여됩니다. 사용여부가 &apos;N&apos; 인 권한은 목록에 나오지
        않습니다.
      </p>
    </section>
  );
}
