'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealAnimation = 'fade-up' | 'fade-left' | 'fade-right';

type RevealProps = {
  children: ReactNode;
  /** 원본 AOS의 data-aos 값과 동일한 의미 */
  animation?: RevealAnimation;
  /** 지연 시간(ms) — 원본 data-wow-delay 대체 */
  delay?: number;
  className?: string;
};

/**
 * AOS / WOW.js 대체 스크롤 리빌 컴포넌트.
 * 외부 애니메이션 라이브러리 없이 IntersectionObserver로 구현한다.
 */
export default function Reveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-animation={animation}
      // 동적으로 계산되는 지연 시간이라 인라인 스타일을 사용한다.
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
