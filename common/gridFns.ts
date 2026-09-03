/**
 * AG-Grid 공통 함수
 *
 * osca 의 common/gridFns.js 중 관리자 화면에서 쓰는 것만 옮겼다.
 */
import type { ColDef, ColGroupDef, GetRowIdParams } from 'ag-grid-community';

/** 그리드에서 CUD 추적에 사용하는 내부 플래그 */
export type GridRowFlags = {
  __isNew?: boolean;
  __isUpdated?: boolean;
  __isDeleted?: boolean;
  /** 신규 행 임시 식별자 */
  internalId?: string;
};

export type GridRow = Record<string, unknown> & GridRowFlags;

/**
 * 컬럼 정의
 *
 * AG-Grid 의 ColDef 에 이 프로젝트에서 쓰는 커스텀 속성을 더한 것이다.
 *  - isKey        : 행 식별 키 (getRowId / 중복 검사 / 수정·삭제 대상 판별)
 *  - isRequired   : 저장 전 필수 입력 검사
 *  - defaultValue : 행 추가 시 초기값
 */
export type GridColDef = ColDef<GridRow> & {
  isKey?: boolean;
  isRequired?: boolean;
  defaultValue?: unknown;
};

export type GridColumnDefs = (GridColDef | ColGroupDef<GridRow>)[];

/** 컬럼 그룹(children)을 펼쳐서 실제 컬럼만 반환한다. */
export function flattenColumnDefs(columnDefs: GridColumnDefs = []): GridColDef[] {
  return columnDefs.flatMap((col) =>
    'children' in col && Array.isArray(col.children)
      ? flattenColumnDefs(col.children as GridColumnDefs)
      : [col as GridColDef],
  );
}

/**
 * isKey 컬럼으로 행 ID 를 만드는 getRowId 함수를 생성한다.
 *
 * 신규 행은 internalId 를, 기존 행은 키 컬럼 값을 '_' 로 이어 붙여 쓴다.
 */
export function createGridRowIdFunction(columnDefs: GridColumnDefs) {
  const keyFields = flattenColumnDefs(columnDefs)
    .filter((col) => col.isKey === true)
    .map((col) => col.field)
    .filter((field): field is string => Boolean(field));

  return (params: GetRowIdParams<GridRow>): string => {
    if (params.data.internalId) return params.data.internalId;

    if (keyFields.length > 0) {
      return keyFields.map((field) => String(params.data[field] ?? '')).join('_');
    }

    console.warn('createGridRowIdFunction: isKey 컬럼이 없어 행 ID 를 만들 수 없습니다.');

    return String(Math.random());
  };
}

/** isKey 컬럼 값을 이어 붙여 복합 키를 만든다. */
export function buildCompositeKey(row: GridRow, keyFields: string[]): string {
  return keyFields.map((field) => String(row[field] ?? '')).join('_');
}
