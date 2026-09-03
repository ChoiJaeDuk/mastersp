'use client';

/**
 * 프로그램 관리 그리드
 * osca 의 app/sys/sys/pgm-mng/components/PgmMngGrid.js 와 같은 구성이다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getPgmList, savePgmList } from '../actions';

export default function PgmMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();

  const selectPgmList = useCallback(async () => {
    setRowData(await getPgmList());
  }, []);

  useEffect(() => {
    selectPgmList();
  }, [selectPgmList]);

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      {
        field: 'PGM_ID',
        headerName: '프로그램ID',
        // 신규 행에서만 키를 입력할 수 있다.
        editable: (params) => params.data?.__isNew === true,
        isKey: true,
        isRequired: true,
        flex: 1,
      },
      { field: 'PGM_NM', headerName: '프로그램명', editable: true, isRequired: true, flex: 1 },
      {
        field: 'PGM_PTH_NM',
        headerName: '경로',
        editable: true,
        isRequired: true,
        flex: 2,
        cellStyle: { textAlign: 'left', alignContent: 'center' },
      },
    ],
    [],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: savePgmList,
    selectAction: selectPgmList,
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
