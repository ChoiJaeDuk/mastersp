'use client';

import { useEffect, useState } from 'react';

/**
 * 행 추가 개수 입력 팝업
 * osca 의 components/grid/AddRowsPopup.js 와 같은 역할이다.
 */
export default function AddRowsPopup({
  isOpen,
  onClose,
  onAddRow,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddRow: (count: number) => void;
}) {
  const [count, setCount] = useState('1');

  // 열릴 때마다 입력값을 초기화한다.
  useEffect(() => {
    if (isOpen) setCount('1');
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = () => {
    const parsed = Number(count);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
      alert('1 ~ 100 사이의 숫자를 입력해 주세요.');
      return;
    }

    onAddRow(parsed);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="행 추가"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-base font-semibold text-ink">행 추가</p>

        <label htmlFor="add-rows-count" className="mt-4 block text-sm text-shell">
          추가할 행 개수
        </label>
        <input
          id="add-rows-count"
          type="number"
          min={1}
          max={100}
          value={count}
          autoFocus
          onChange={(event) => setCount(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit();
          }}
          className="mt-2 w-full border border-[#ddd] px-3 py-2 text-sm outline-none focus:border-brand"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-[#ddd] px-4 py-2 text-sm text-shell hover:bg-[#f5f5f5]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            className="bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
