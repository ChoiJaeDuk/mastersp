'use client';

import { ArrowUpIcon } from '@/components/ui/Icons';

/**
 * 푸터 상단의 맨 위로 이동 버튼 (원본 .quick-menu .top-btn).
 * 45도 회전한 주황색 사각형 안에 화살표를 넣는다.
 */
export default function ScrollTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="absolute top-[-24px] left-1/2 -translate-x-1/2">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        className="flex h-12 w-12 rotate-45 items-center justify-center bg-brand transition-opacity hover:opacity-85"
      >
        <ArrowUpIcon className="h-5 w-5 -rotate-45 text-white" />
      </button>
    </div>
  );
}
