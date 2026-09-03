'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * 팝업 (원본 jQuery magnific-popup 대체)
 *
 * 원본 kor/pop/*.html 은 .popup 마크업만 갖고 있고, 바깥 래퍼(.mfp-bg / .mfp-wrap /
 * .mfp-container / .mfp-content)는 magnific-popup 이 만들어 준다.
 * 여기서는 같은 클래스 구조를 그대로 생성하고, 오버레이 클릭 · ESC · 닫기 버튼으로 닫는다.
 */
export default function Popup({
  isOpen,
  onClose,
  title,
  /** 원본 .popup 뒤에 붙는 변형 클래스 (popup--sm popup--privary 등) */
  variant = 'popup--sm popup--privary',
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  variant?: string;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // 열려 있는 동안 배경 스크롤을 막고 ESC 로 닫는다. (원본 magnific-popup 동작)
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div className="mfp-bg mfp-ready" onClick={onClose} />
      <div className="mfp-wrap mfp-ready" tabIndex={-1}>
        <div className="mfp-container mfp-inline-holder" onClick={onClose}>
          <div className="mfp-content" onClick={(event) => event.stopPropagation()}>
            <div
              className={`popup ${variant}`}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div className="popup-title-bx">
                <p className="title">{title}</p>
                <button ref={closeRef} type="button" className="mfp-close" onClick={onClose}>
                  <span aria-hidden>×</span>
                  <span className="sr-only">닫기</span>
                </button>
              </div>

              <div className="text-bx">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
