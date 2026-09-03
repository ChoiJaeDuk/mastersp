'use client';

/**
 * 공통 AG그리드 설정
 *
 * osca 의 components/grid/CommonGrid.js 와 같은 역할이다.
 * 화면마다 반복되는 defaultColDef / 행 선택 / CUD 행 스타일 / 한글 로케일을 여기에 모은다.
 */
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type GetRowIdFunc } from 'ag-grid-community';

import type { GridColumnDefs, GridRow } from '@/common/gridFns';
import type { GridHandler } from '@/hooks/useGridHandler';

import AddRowsPopup from './AddRowsPopup';

ModuleRegistry.registerModules([AllCommunityModule]);

type CommonGridProps = AgGridReactProps<GridRow> & {
  gridHandler: GridHandler;
  rowData: GridRow[] | undefined;
  columnDefs: GridColumnDefs;
  getRowId?: GetRowIdFunc<GridRow>;
  /** 그리드 높이 (기본 55vh) */
  height?: string;
};

export default function CommonGrid({
  gridHandler,
  rowData,
  columnDefs,
  getRowId,
  height = '55vh',
  ...rest
}: CommonGridProps) {
  return (
    <>
      <div style={{ width: '100%', height }}>
        <AgGridReact<GridRow>
          onGridReady={gridHandler.onGridReady}
          onCellValueChanged={gridHandler.onCellValueChanged}
          rowData={rowData}
          columnDefs={columnDefs}
          getRowId={getRowId}
          defaultColDef={{
            cellStyle: { textAlign: 'center', alignContent: 'center' },
            sortable: true,
            resizable: true,
            singleClickEdit: true,
          }}
          rowSelection={{
            mode: 'multiRow',
            checkboxes: false,
            headerCheckbox: false,
            enableClickSelection: true,
          }}
          stopEditingWhenCellsLoseFocus
          rowClassRules={{
            'row-added': (params) => params.data?.__isNew === true,
            'row-updated': (params) => params.data?.__isUpdated === true,
            'row-deleted': (params) => params.data?.__isDeleted === true,
          }}
          localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
          {...rest}
        />
      </div>

      <AddRowsPopup
        isOpen={gridHandler.isPopupOpen}
        onClose={gridHandler.closePopup}
        onAddRow={gridHandler.handleAddRow}
      />
    </>
  );
}
