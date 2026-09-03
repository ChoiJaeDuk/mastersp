'use client';

/**
 * 권한별 메뉴 관리 그리드
 *
 * 권한을 고르면 3단계 메뉴 전체가 뜨고, 체크한 메뉴만 그 권한에 부여된다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler, type GridChanges } from '@/hooks/useGridHandler';

import { getAuthMenuList, getUseAuthList, saveAuthMenuList } from '../actions';

export default function AuthMenuMngGrid() {
  const [auths, setAuths] = useState<{ AUTH_ID: string; AUTH_NM: string }[]>([]);
  const [authId, setAuthId] = useState('');
  const [rowData, setRowData] = useState<GridRow[]>();

  // 권한 목록은 최초 1회만 조회하고, 첫 권한을 기본 선택한다.
  useEffect(() => {
    getUseAuthList().then((list) => {
      setAuths(list);
      setAuthId((prev) => prev || (list[0]?.AUTH_ID ?? ''));
    });
  }, []);

  const selectAuthMenuList = useCallback(async () => {
    if (!authId) {
      setRowData([]);
      return;
    }

    setRowData((await getAuthMenuList(authId)) as unknown as GridRow[]);
  }, [authId]);

  useEffect(() => {
    selectAuthMenuList();
  }, [selectAuthMenuList]);

  const saveAction = useCallback(
    (changes: GridChanges) => saveAuthMenuList(changes, authId),
    [authId],
  );

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      { field: 'MENU_ID', headerName: '메뉴ID', isKey: true, editable: false, flex: 1 },
      { field: 'MENU1_NM', headerName: '대분류', editable: false, flex: 1 },
      { field: 'MENU2_NM', headerName: '중분류', editable: false, flex: 1 },
      { field: 'MENU_NM', headerName: '메뉴명', editable: false, flex: 1 },
      {
        field: 'PGM_PTH_NM',
        headerName: '경로',
        editable: false,
        flex: 2,
        cellStyle: { textAlign: 'left', alignContent: 'center' },
      },
      {
        field: 'AUTH_CHK',
        headerName: '권한 부여',
        editable: true,
        cellDataType: 'boolean',
        width: 140,
      },
    ],
    [],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction,
    selectAction: selectAuthMenuList,
  });

  const getRowId = useMemo(() => createGridRowIdFunction(columnDefs), [columnDefs]);

  return (
    <section className="bg-white p-4 shadow-sm">
      <GridToolbar gridHandler={gridHandler} editable={false}>
        <label htmlFor="auth-select" className="text-sm text-shell">
          권한
        </label>
        <select
          id="auth-select"
          value={authId}
          onChange={(event) => setAuthId(event.target.value)}
          className="border border-[#ddd] bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-brand"
        >
          {auths.map((auth) => (
            <option key={auth.AUTH_ID} value={auth.AUTH_ID}>
              {auth.AUTH_NM} ({auth.AUTH_ID})
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={gridHandler.handleSaveChanges}
          disabled={gridHandler.loading || !authId}
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
        height="60vh"
      />
    </section>
  );
}
