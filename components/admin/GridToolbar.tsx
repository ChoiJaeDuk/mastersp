'use client';

import type { GridHandler } from '@/hooks/useGridHandler';

/**
 * 그리드 상단 버튼 모음
 * osca 각 관리 화면의 "새로고침 / 행 추가 / 행 삭제 / 저장" 버튼 줄과 같다.
 */
export default function GridToolbar({
  gridHandler,
  /** 행 추가·삭제·저장 버튼 노출 여부 (조회 전용 화면은 false) */
  editable = true,
  showExport = false,
  children,
}: {
  gridHandler: GridHandler;
  editable?: boolean;
  showExport?: boolean;
  children?: React.ReactNode;
}) {
  const buttonClass =
    'border border-[#ddd] bg-white px-3 py-1.5 text-sm text-shell transition-colors ' +
    'hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {children}

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {gridHandler.hasChanges ? (
          <span className="mr-1 text-sm text-brand">저장되지 않은 변경사항이 있습니다</span>
        ) : null}

        <button
          type="button"
          onClick={gridHandler.handleSearch}
          disabled={gridHandler.loading}
          className={buttonClass}
        >
          새로고침
        </button>

        {showExport ? (
          <button type="button" onClick={gridHandler.exportCsv} className={buttonClass}>
            CSV 내보내기
          </button>
        ) : null}

        {editable ? (
          <>
            <button type="button" onClick={gridHandler.openPopup} className={buttonClass}>
              행 추가
            </button>
            <button type="button" onClick={gridHandler.handleDeleteRows} className={buttonClass}>
              행 삭제
            </button>
            <button
              type="button"
              onClick={gridHandler.handleSaveChanges}
              disabled={gridHandler.loading}
              className="bg-brand px-4 py-1.5 text-sm font-semibold text-white transition-opacity
                         hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              저장
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
