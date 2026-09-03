'use client';

/**
 * 고객문의 관리 (목록 그리드 + 상세/답변 패널)
 *
 * 행을 클릭하면 아래에 상세가 열리고, 답변을 저장하면 신청자에게 회신 메일을 보낸다.
 * (레거시 sadmin 의 inquiryview.php + board_ajax_proc.php 'reply' 에 해당)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RowClickedEvent } from 'ag-grid-community';

import GridToolbar from '@/components/admin/GridToolbar';
import CommonGrid from '@/components/grid/CommonGrid';
import { commonTheme } from '@/common/gridConst';
import { createGridRowIdFunction, type GridColumnDefs, type GridRow } from '@/common/gridFns';
import { useGridHandler } from '@/hooks/useGridHandler';

import { getInquiry, getInquiryList, replyInquiry, saveInquiryList } from '../actions';
import type { InquiryDetail } from '../data';

const STATUS_LABELS: Record<string, string> = {
  RECV: '접수',
  DONE: '답변완료',
};

export default function InquiryMngGrid() {
  const [rowData, setRowData] = useState<GridRow[]>();
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendMailToWriter, setSendMailToWriter] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectInquiryList = useCallback(async () => {
    setRowData(await getInquiryList());
  }, []);

  useEffect(() => {
    selectInquiryList();
  }, [selectInquiryList]);

  const openDetail = useCallback(async (event: RowClickedEvent<GridRow>) => {
    const inqSqno = Number(event.data?.INQ_SQNO);

    if (!inqSqno) return;

    const found = await getInquiry(inqSqno);

    setDetail(found);
    setReplyText(found?.RPLY_CTT ?? '');
    setMessage('');
  }, []);

  const submitReply = async () => {
    if (!detail) return;

    setSaving(true);
    setMessage('');

    try {
      const result = await replyInquiry(detail.INQ_SQNO, replyText, sendMailToWriter);

      setMessage(result.message);

      if (result.success) {
        await selectInquiryList();
        setDetail(await getInquiry(detail.INQ_SQNO));
      }
    } finally {
      setSaving(false);
    }
  };

  const columnDefs = useMemo<GridColumnDefs>(
    () => [
      { field: 'INQ_SQNO', headerName: '번호', isKey: true, editable: false, width: 90 },
      {
        field: 'PRCS_STS_CD',
        headerName: '상태',
        editable: false,
        width: 110,
        valueFormatter: (params) => STATUS_LABELS[String(params.value)] ?? String(params.value ?? ''),
      },
      { field: 'INQ_FLD_NM', headerName: '문의분야', editable: false, flex: 1 },
      { field: 'CO_NM', headerName: '회사명', editable: false, flex: 1 },
      { field: 'WRTR_NM', headerName: '이름', editable: false, width: 110 },
      { field: 'WRTR_TELNO', headerName: '연락처', editable: false, width: 140 },
      { field: 'WRTR_EML', headerName: '이메일', editable: false, flex: 1 },
      { field: 'FRST_REG_DT', headerName: '접수일시', editable: false, width: 150 },
      { field: 'RPLY_DT', headerName: '답변일시', editable: false, width: 150 },
    ],
    [],
  );

  const gridHandler = useGridHandler({
    columnDefs,
    saveAction: saveInquiryList,
    selectAction: selectInquiryList,
    exportFileName: 'inquiry.csv',
  });

  const getRowId = useMemo(() => createGridRowIdFunction(columnDefs), [columnDefs]);

  const inputClass =
    'w-full border border-[#ddd] px-3 py-2 text-sm text-ink outline-none focus:border-brand';

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 shadow-sm">
        {/* 문의는 사이트에서 접수되므로 행 추가는 없고, 삭제(소프트 삭제)와 저장만 제공한다 */}
        <GridToolbar gridHandler={gridHandler} editable={false} showExport>
          <button
            type="button"
            onClick={gridHandler.handleDeleteRows}
            className="border border-[#ddd] bg-white px-3 py-1.5 text-sm text-shell
                       transition-colors hover:border-brand hover:text-brand"
          >
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
        </GridToolbar>

        <CommonGrid
          gridHandler={gridHandler}
          rowData={rowData}
          columnDefs={columnDefs}
          getRowId={getRowId}
          theme={commonTheme}
          height="40vh"
          onRowClicked={openDetail}
        />
        <p className="mt-3 text-xs text-shell">
          행을 클릭하면 아래에 상세 내용과 답변 입력란이 열립니다. 삭제는 목록에서 감추는
          소프트 삭제입니다.
        </p>
      </section>

      {detail ? (
        <section className="bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-ink">
              #{detail.INQ_SQNO} {detail.INQ_FLD_NM}
            </h2>
            <span className="text-sm text-shell">
              {STATUS_LABELS[detail.PRCS_STS_CD] ?? detail.PRCS_STS_CD} · 접수 {detail.FRST_REG_DT}
            </span>
          </div>

          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {[
              ['회사명', detail.CO_NM],
              ['직함', detail.PSTN_NM],
              ['이름', detail.WRTR_NM],
              ['연락처', detail.WRTR_TELNO],
              ['이메일', detail.WRTR_EML],
              ['등록 IP', detail.WRTR_IP],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="w-16 shrink-0 text-shell">{label}</dt>
                <dd className="text-ink">{value || '-'}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <p className="text-sm font-semibold text-ink">문의내용</p>
            <p className="mt-2 border border-[#eee] bg-[#fafafa] p-4 text-sm whitespace-pre-wrap text-shell">
              {detail.INQ_CTT}
            </p>
          </div>

          <div className="mt-5">
            <label htmlFor="reply" className="text-sm font-semibold text-ink">
              답변
            </label>
            <textarea
              id="reply"
              rows={6}
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="답변 내용을 입력하세요."
              className={`${inputClass} mt-2 resize-y`}
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-shell">
                <input
                  type="checkbox"
                  checked={sendMailToWriter}
                  onChange={(event) => setSendMailToWriter(event.target.checked)}
                  className="size-4 accent-[#fe6b00]"
                />
                신청자({detail.WRTR_EML})에게 회신 메일 발송
              </label>

              <button
                type="button"
                onClick={submitReply}
                disabled={saving}
                className="ml-auto bg-brand px-5 py-2 text-sm font-semibold text-white
                           transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? '저장 중…' : '답변 저장'}
              </button>
            </div>

            <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-brand">
              {message}
            </p>

            {detail.RPLY_DT ? (
              <p className="text-xs text-shell">
                최종 답변 : {detail.RPLY_DT} ({detail.RPLY_USER_ID})
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
