'use client';

import { useEffect, useState } from 'react';

/**
 * 시작 팝업 (원본 kor/pop/youtube-pop.html · modal-pop.html)
 *
 * 원본은 두 파일 모두 .modal.start_pop 구조에 본문(유튜브 iframe / 스와이퍼 슬라이드)만
 * 다르므로 하나의 컴포넌트로 합치고 `kind` 로 나눴다.
 * "오늘 열지 않기" 는 원본과 같은 동작이며, 체크 시 하루 동안 localStorage 로 감춘다.
 */
export type StartPopupSlide = {
  image: string;
  href?: string;
  alt?: string;
};

type StartPopupProps = {
  /** localStorage 키를 나누는 식별자 (팝업이 여러 개일 수 있다) */
  id: string;
  /** 팝업 제목 (스크린리더용) */
  title?: string;
  /** 화면 위치 (원본은 인라인 style 로 left/top 을 준다) */
  position?: { left: number; top: number };
} & (
  | { kind: 'youtube'; youtubeId: string; slides?: never }
  | { kind: 'slider'; slides: StartPopupSlide[]; youtubeId?: never }
);

/** '오늘 열지 않기' 저장 키 */
const storageKey = (id: string) => `mastersp:start-popup:${id}`;

/** 오늘 자정까지 남은 시간(ms) */
function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return midnight.getTime() - now.getTime();
}

export default function StartPopup(props: StartPopupProps) {
  const { id, title = '팝업', position = { left: 0, top: 0 } } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // '오늘 열지 않기' 가 유효하면 아예 띄우지 않는다.
  useEffect(() => {
    try {
      const until = Number(window.localStorage.getItem(storageKey(id)) ?? 0);

      if (Number.isFinite(until) && until > Date.now()) return;
    } catch {
      // 스토리지를 못 읽는 환경(시크릿 모드 등)에서는 그냥 띄운다.
    }

    setIsOpen(true);
  }, [id]);

  const close = () => {
    if (hideToday) {
      try {
        window.localStorage.setItem(storageKey(id), String(Date.now() + msUntilMidnight()));
      } catch {
        // 저장 실패는 무시한다.
      }
    }

    setIsOpen(false);
  };

  if (!isOpen) return null;

  const slides = props.kind === 'slider' ? props.slides : [];
  const checkboxId = `start-popup-hide-${id}`;

  return (
    <>
      <div className="modal-backdrop" onClick={close} />

      <div
        className="modal fade in start_pop"
        id={`modal-${id}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ display: 'block', left: `${position.left}px`, top: `${position.top}px` }}
      >
        <div className="modal_standard">
          <div className="modal_wrap">
            <div className="modal-dialog">
              <div className="modal-content">
                {props.kind === 'slider' && slides.length > 1 ? (
                  <div className="modal-header">
                    <div className="swiper-pagination">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`swiper-pagination-bullet${
                            index === slideIndex ? ' swiper-pagination-bullet-active' : ''
                          }`}
                          onClick={() => setSlideIndex(index)}
                        >
                          <span className="sr-only">{index + 1}번째 슬라이드</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="modal-body">
                  <div className="inner">
                    {props.kind === 'youtube' ? (
                      <div className="modal-youtube-popup">
                        <div className="embed-responsive embed-responsive-16by9">
                          <iframe
                            src={`https://www.youtube.com/embed/${props.youtubeId}`}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="modal-swiper">
                        <div className="swiper-container">
                          <div className="swiper-wrapper">
                            {slides.map((slide, index) => (
                              <div
                                key={index}
                                className="swiper-slide"
                                hidden={index !== slideIndex}
                              >
                                {slide.href ? (
                                  <a href={slide.href}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={slide.image} alt={slide.alt ?? ''} />
                                  </a>
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={slide.image} alt={slide.alt ?? ''} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {slides.length > 1 ? (
                          <>
                            <button
                              type="button"
                              className="swiper-button swiper-button--prev"
                              onClick={() =>
                                setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
                              }
                            >
                              <i className="xi-angle-left-thin" aria-hidden />
                              <span className="sr-only">이전</span>
                            </button>
                            <button
                              type="button"
                              className="swiper-button swiper-button--next"
                              onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                            >
                              <i className="xi-angle-right-thin" aria-hidden />
                              <span className="sr-only">다음</span>
                            </button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer clearfix">
                  <div className="check-area left">
                    <input
                      type="checkbox"
                      id={checkboxId}
                      checked={hideToday}
                      onChange={(event) => setHideToday(event.target.checked)}
                    />
                    <label htmlFor={checkboxId} className="ml_05">
                      오늘 열지 않기
                    </label>
                  </div>
                  <button type="button" className="pop-close right" onClick={close}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
