'use client';

/**
 * 접속 이력 조회 그리드 (조회 전용)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getUserHstList } from '../actions';

export default function UserHstGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();

  const selectUserHstList = useCallback(async () => {
    setRowData(await getUserHstList());
  }, []);

  useEffect(() => {
    selectUserHstList();
  }, [selectUserHstList]);

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      { field: 'HST_SQNO', headerName: '번호', isKey: true, width: 110 },
      { field: 'USER_ID', headerName: '아이디', flex: 1 },
      { field: 'USER_NM', headerName: '사용자명', flex: 1 },
      { field: 'CNN_IP', headerName: '접속 IP', flex: 1 },
      { field: 'CNN_DT', headerName: '접속일시', flex: 1 },
    ],
    [],
  );

  // 조회 전용이라 저장 액션은 호출되지 않는다.
  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: async () => ({ success: true }),
    selectAction: selectUserHstList,
    exportFileName: 'user-history.csv',
  });

  const getRowId = useMemo(() => createGridRowIdFunction(columnDefs), [columnDefs]);

  return (
    <section className="bg-white p-4 shadow-sm">
      <GridToolbar gridHandler={gridHandler} editable={false} showExport />
      <CommonGrid
        gridHandler={gridHandler}
        rowData={rowData}
        columnDefs={columnDefs}
        getRowId={getRowId}
        theme={commonTheme}
        height="60vh"
      />
      <p className="mt-3 text-xs text-shell">최근 500건까지 조회합니다.</p>
    </section>
  );
}
