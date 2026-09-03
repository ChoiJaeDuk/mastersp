/**
 * 그리드 공통 Constants
 *
 * osca 는 colorSchemeDarkBlue 를 쓰지만, 이 프로젝트의 관리자 화면은
 * 공개 사이트와 같은 밝은 톤이라 themeQuartz 를 브랜드 색으로 맞춰서 쓴다.
 * (osca 와 동일한 다크 테마로 바꾸려면 아래 withPart(colorSchemeDarkBlue) 로 교체하면 된다)
 */
import { themeQuartz } from 'ag-grid-community';

/** 공통 테마 */
export const commonTheme = themeQuartz.withParams({
  accentColor: '#fe6b00',
  borderColor: '#e5e5e5',
  headerBackgroundColor: '#f5f5f5',
  headerTextColor: '#333333',
  fontFamily:
    'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  fontSize: 13,
  headerFontWeight: 600,
  rowHeight: 38,
  headerHeight: 40,
});

/** 사용여부 / 승인여부 등 Y·N 셀에서 공통으로 쓰는 셀 에디터 설정 */
export const YN_CELL_EDITOR = {
  cellEditor: 'agSelectCellEditor',
  cellEditorParams: { values: ['Y', 'N'] },
} as const;
