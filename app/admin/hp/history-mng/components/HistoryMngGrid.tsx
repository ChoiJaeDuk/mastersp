'use client';

/**
 * 연혁 관리 그리드
 * 공개 페이지 /company#history 에 노출되는 내용이다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme, YN_CELL_EDITOR } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getHistoryList, saveHistoryList } from '../actions';

/** 월 선택 값 ('01' ~ '12') */
const MONTHS = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));

export default function HistoryMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();

  const selectHistoryList = useCallback(async () => {
    setRowData(await getHistoryList());
  }, []);

  useEffect(() => {
    selectHistoryList();
  }, [selectHistoryList]);

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      { field: 'HIST_SQNO', headerName: '번호', isKey: true, editable: false, width: 100 },
      {
        field: 'HIST_YR',
        headerName: '연도',
        editable: true,
        isRequired: true,
        width: 110,
        defaultValue: String(new Date().getFullYear()),
      },
      {
        field: 'HIST_MM',
        headerName: '월',
        editable: true,
        isRequired: true,
        width: 90,
        defaultValue: '01',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: MONTHS },
      },
      {
        field: 'HIST_CTT',
        headerName: '내용',
        editable: true,
        isRequired: true,
        flex: 3,
        cellStyle: { textAlign: 'left', alignContent: 'center' },
      },
      { field: 'MENU_SEQO', headerName: '순번', editable: true, width: 90, defaultValue: 999 },
      {
        field: 'USE_YN',
        headerName: '노출여부',
        editable: true,
        isRequired: true,
        defaultValue: 'Y',
        width: 110,
        ...YN_CELL_EDITOR,
      },
    ],
    [],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: saveHistoryList,
    selectAction: selectHistoryList,
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
        height="60vh"
      />
      <p className="mt-3 text-xs text-shell">
        저장하면 회사소개 페이지의 연혁이 즉시 갱신됩니다. 같은 연도 안에서는 월 내림차순, 그 다음
        순번 순으로 표시됩니다.
      </p>
    </section>
  );
}
