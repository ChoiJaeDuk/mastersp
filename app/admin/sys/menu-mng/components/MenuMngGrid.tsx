'use client';

/**
 * 메뉴 관리 그리드
 *
 * 상위 메뉴 / 프로그램은 드롭다운으로 고르게 하고,
 * 화면에는 코드가 아니라 이름이 보이도록 valueFormatter 를 건다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme, YN_CELL_EDITOR } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getMenuList, getMenuOptions, saveMenuList } from '../actions';

type Options = {
  uppoMenus: { MENU_ID: string; MENU_NM: string }[];
  programs: { PGM_ID: string; PGM_NM: string }[];
};

export default function MenuMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();
  const [options, setOptions] = useState<Options>({ uppoMenus: [], programs: [] });

  const selectMenuList = useCallback(async () => {
    const [menus, menuOptions] = await Promise.all([getMenuList(), getMenuOptions()]);

    setRowData(menus);
    setOptions(menuOptions);
  }, []);

  useEffect(() => {
    selectMenuList();
  }, [selectMenuList]);

  const columnDefs = useMemo<GridColumnDefs>(() => {
    const uppoMenuNames = new Map(options.uppoMenus.map((menu) => [menu.MENU_ID, menu.MENU_NM]));
    const programNames = new Map(options.programs.map((program) => [program.PGM_ID, program.PGM_NM]));

    return [
      {
        field: 'MENU_ID',
        headerName: '메뉴ID',
        editable: (params) => params.data?.__isNew === true,
        isKey: true,
        isRequired: true,
        flex: 1,
      },
      { field: 'MENU_NM', headerName: '메뉴명', editable: true, isRequired: true, flex: 1 },
      {
        field: 'MENU_STEP',
        headerName: '단계',
        editable: true,
        isRequired: true,
        defaultValue: '3',
        width: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['1', '2', '3'] },
      },
      {
        field: 'UPPO_MENU_ID',
        headerName: '상위 메뉴',
        editable: true,
        flex: 1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['', ...options.uppoMenus.map((menu) => menu.MENU_ID)] },
        valueFormatter: (params) =>
          params.value ? (uppoMenuNames.get(String(params.value)) ?? String(params.value)) : '',
      },
      {
        field: 'PGM_ID',
        headerName: '연결 프로그램',
        editable: true,
        flex: 1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['', ...options.programs.map((program) => program.PGM_ID)] },
        valueFormatter: (params) =>
          params.value ? (programNames.get(String(params.value)) ?? String(params.value)) : '',
      },
      { field: 'MENU_SEQO', headerName: '순번', editable: true, width: 90, defaultValue: 1 },
      { field: 'PARM_CTT', headerName: '파라미터', editable: true, flex: 1 },
      {
        field: 'USE_YN',
        headerName: '사용여부',
        editable: true,
        isRequired: true,
        defaultValue: 'Y',
        width: 110,
        ...YN_CELL_EDITOR,
      },
    ];
  }, [options]);

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: saveMenuList,
    selectAction: selectMenuList,
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
        권한은 3단계 메뉴에 부여됩니다. 새 화면을 추가하면 프로그램 관리에 경로를 먼저 등록한 뒤
        여기서 메뉴로 연결하고, 권한별 메뉴 관리에서 권한을 부여하세요.
      </p>
    </section>
  );
}
