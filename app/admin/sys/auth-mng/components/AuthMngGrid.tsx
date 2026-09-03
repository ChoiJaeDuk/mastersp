'use client';

/**
 * 권한 관리 그리드
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme, YN_CELL_EDITOR } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getAuthList, saveAuthList } from '../actions';

export default function AuthMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();

  const selectAuthList = useCallback(async () => {
    setRowData(await getAuthList());
  }, []);

  useEffect(() => {
    selectAuthList();
  }, [selectAuthList]);

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      {
        field: 'AUTH_ID',
        headerName: '권한ID',
        editable: (params) => params.data?.__isNew === true,
        isKey: true,
        isRequired: true,
        flex: 1,
      },
      { field: 'AUTH_NM', headerName: '권한명', editable: true, isRequired: true, flex: 2 },
      {
        field: 'USE_YN',
        headerName: '사용여부',
        editable: true,
        isRequired: true,
        defaultValue: 'Y',
        width: 140,
        ...YN_CELL_EDITOR,
      },
    ],
    [],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: saveAuthList,
    selectAction: selectAuthList,
  });

  const getRowId = useMemo(() => createGridRowIdFunction(columnDefs), [columnDefs]);

  return (
    <section className="bg-white p-4 shadow-sm">
      <GridToolbar gridHandler={gridHandler} />
      <CommonGrid
        gridHandler={gridHandler}
        rowData={rowData}
        columnDefs={columnDefs}
        getRowId={getRowId}
        theme={commonTheme}
      />
    </section>
  );
}
