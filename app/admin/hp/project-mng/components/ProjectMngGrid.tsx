'use client';

/**
 * 수행과제 관리 (분류 그리드 + 과제 그리드)
 *
 * osca 의 메뉴 관리처럼 상단에 상위 목록(분류), 하단에 상세 목록(과제)을 둔다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme, YN_CELL_EDITOR } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';
import { PROJECT_KINDS } from '@/app/(site)/project/types';

import {
  getProjectCtgList,
  getProjectList,
  saveProjectCtgList,
  saveProjectList,
} from '../actions';

export default function ProjectMngGrid() {
  const [ctgRows, setCtgRows] = useState<GridRow[]>();
  const [prjRows, setPrjRows] = useState<GridRow[]>();

  const selectCtgList = useCallback(async () => {
    setCtgRows(await getProjectCtgList());
  }, []);

  const selectPrjList = useCallback(async () => {
    setPrjRows(await getProjectList());
  }, []);

  useEffect(() => {
    selectCtgList();
    selectPrjList();
  }, [selectCtgList, selectPrjList]);

  /* ---------------- 분류(연도) 그리드 ---------------- */

  const ctgColumnDefs = useMemo<GridColumnDefs>(
    () => [
      { field: 'CTG_SQNO', headerName: '번호', isKey: true, editable: false, width: 100 },
      {
        field: 'CTG_NM',
        headerName: '분류명 (연도)',
        editable: true,
        isRequired: true,
        flex: 1,
        defaultValue: String(new Date().getFullYear()),
      },
      { field: 'MENU_SEQO', headerName: '순번', editable: true, width: 90, defaultValue: 999 },
      {
        field: 'USE_YN',
        headerName: '사용여부',
        editable: true,
        isRequired: true,
        defaultValue: 'Y',
        width: 110,
        ...YN_CELL_EDITOR,
      },
    ],
    [],
  );

  const ctgHandler = useGridHandler({
    columnDefs: ctgColumnDefs,
    saveAction: async (changes) => {
      const result = await saveProjectCtgList(changes);

      // 분류가 바뀌면 과제 그리드의 드롭다운도 갱신해야 한다.
      if (result.success) await selectPrjList();

      return result;
    },
    selectAction: selectCtgList,
  });

  const ctgGetRowId = useMemo(() => createGridRowIdFunction(ctgColumnDefs), [ctgColumnDefs]);

  /* ---------------- 과제 그리드 ---------------- */

  const categories = useMemo(
    () =>
      (ctgRows ?? []).map((row) => ({
        code: String(row.CTG_SQNO),
        name: String(row.CTG_NM),
      })),
    [ctgRows],
  );

  const prjColumnDefs = useMemo<GridColumnDefs>(() => {
    const categoryNames = new Map(categories.map((category) => [category.code, category.name]));
    const kindNames = new Map<string, string>(PROJECT_KINDS.map((kind) => [kind.code, kind.label]));

    return [
      { field: 'PRJ_SQNO', headerName: '번호', isKey: true, editable: false, width: 100 },
      {
        field: 'PRJ_KND_CD',
        headerName: '구분',
        editable: true,
        isRequired: true,
        width: 160,
        defaultValue: '1',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: PROJECT_KINDS.map((kind) => kind.code) },
        valueFormatter: (params) => kindNames.get(String(params.value)) ?? String(params.value ?? ''),
      },
      {
        field: 'CTG_SQNO',
        headerName: '분류',
        editable: true,
        width: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['', ...categories.map((category) => category.code)] },
        valueFormatter: (params) =>
          params.value ? (categoryNames.get(String(params.value)) ?? String(params.value)) : '',
      },
      {
        field: 'PRJ_NM',
        headerName: '과제명',
        editable: true,
        isRequired: true,
        flex: 2,
        cellStyle: { textAlign: 'left', alignContent: 'center' },
      },
      { field: 'ORDR_NM', headerName: '발주처', editable: true, flex: 1 },
      { field: 'BGNG_DE', headerName: '시작일', editable: true, width: 130 },
      { field: 'END_DE', headerName: '종료일', editable: true, width: 130 },
      {
        field: 'PRJ_CTT',
        headerName: '내용',
        editable: true,
        flex: 2,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        cellEditorParams: { maxLength: 5000, rows: 10, cols: 60 },
        cellStyle: { textAlign: 'left', alignContent: 'center' },
        // 여러 줄 내용은 첫 줄만 보여준다. (공개 화면에서는 줄 단위로 목록이 된다)
        valueFormatter: (params) => {
          const text = String(params.value ?? '');
          const [first, ...rest] = text.split('\n');

          return rest.length > 0 ? `${first} … (+${rest.length}줄)` : first;
        },
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
    ];
  }, [categories]);

  const prjHandler = useGridHandler({
    columnDefs: prjColumnDefs,
    saveAction: saveProjectList,
    selectAction: selectPrjList,
  });

  const prjGetRowId = useMemo(() => createGridRowIdFunction(prjColumnDefs), [prjColumnDefs]);

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-ink">분류 (연도)</h2>
        <GridToolbar gridHandler={ctgHandler} />
        <CommonGrid
          gridHandler={ctgHandler}
          rowData={ctgRows}
          columnDefs={ctgColumnDefs}
          getRowId={ctgGetRowId}
          theme={commonTheme}
          height="25vh"
        />
      </section>

      <section className="bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-ink">수행과제</h2>
        <GridToolbar gridHandler={prjHandler} />
        <CommonGrid
          gridHandler={prjHandler}
          rowData={prjRows}
          columnDefs={prjColumnDefs}
          getRowId={prjGetRowId}
          theme={commonTheme}
          height="45vh"
        />
        <p className="mt-3 text-xs text-shell">
          날짜는 <code>YYYY-MM-DD</code> 형식으로 입력하세요. 내용은 셀을 더블클릭하면 여러 줄로
          입력할 수 있고, 공개 화면에서는 줄 단위로 항목이 나뉩니다.
        </p>
      </section>
    </div>
  );
}
