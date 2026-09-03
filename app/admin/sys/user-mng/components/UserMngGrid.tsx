'use client';

/**
 * 사용자 관리 그리드
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme, YN_CELL_EDITOR } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getUserList, saveUserList } from '../actions';

export default function UserMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();

  const selectUserList = useCallback(async () => {
    setRowData(await getUserList());
  }, []);

  useEffect(() => {
    selectUserList();
  }, [selectUserList]);

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      {
        field: 'USER_ID',
        headerName: '아이디',
        editable: (params) => params.data?.__isNew === true,
        isKey: true,
        isRequired: true,
        flex: 1,
      },
      { field: 'USER_NM', headerName: '사용자명', editable: true, isRequired: true, flex: 1 },
      {
        field: 'USER_PWD',
        headerName: '비밀번호',
        editable: true,
        flex: 1,
        // 저장된 해시는 내려오지 않는다. 값을 입력한 경우에만 재설정된다.
        valueFormatter: (params) => (params.value ? '●'.repeat(String(params.value).length) : ''),
        tooltipValueGetter: () => '입력하면 비밀번호가 재설정됩니다. 비워두면 기존 비밀번호를 유지합니다.',
      },
      { field: 'USER_EML', headerName: '이메일', editable: true, flex: 1 },
      {
        field: 'USE_YN',
        headerName: '사용여부',
        editable: true,
        isRequired: true,
        defaultValue: 'Y',
        width: 110,
        ...YN_CELL_EDITOR,
      },
      {
        field: 'APR_YN',
        headerName: '승인여부',
        editable: true,
        isRequired: true,
        defaultValue: 'N',
        width: 110,
        ...YN_CELL_EDITOR,
      },
      { field: 'APR_NM', headerName: '승인자', editable: false, width: 120 },
      { field: 'FRST_REG_DT', headerName: '등록일시', editable: false, width: 160 },
    ],
    [],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: saveUserList,
    selectAction: selectUserList,
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
        tooltipShowDelay={300}
      />
      <p className="mt-3 text-xs text-shell">
        비밀번호 칸은 항상 비어 있습니다. 값을 입력한 행만 비밀번호가 재설정되며, 저장 시 bcrypt 로
        해시됩니다. 로그인은 <strong>사용여부·승인여부가 모두 Y</strong> 인 계정만 가능합니다.
      </p>
    </section>
  );
}
