'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const HERO = {
  en1: 'Energy',
  en2: 'is Our Life',
  ko: '에너지는 우리의 삶을 움직이는 힘입니다.',
  desc: ['장인의공간은 친환경 기술과 혁신적인 솔루션으로', '지속 가능한 미래를 만들어갑니다.'],
};

/** 원본 .img-bx 초기 크기: width 80vw, padding-bottom 57.1875% → 45.75vw */
const START_WIDTH_VW = 80;
const START_HEIGHT_VW = 45.75;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const mixColor = (from: number[], to: number[], t: number) =>
  `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * t)).join(' ')})`;

/**
 * 메인 비주얼 + 인트로 이미지 확대 인터랙션.
 *
 * 원본은 GSAP ScrollTrigger로 섹션을 pin 한 뒤 이미지를 100vw/100vh까지 키우고
 * 타이틀 색을 흰색으로 바꾼다. 외부 라이브러리 설치 없이
 * position:sticky + scroll 진행률 계산으로 동일한 동작을 재현한다.
 * (1024px 미만에서는 원본과 동일하게 애니메이션 없이 정적으로 노출)
 */
export default function HeroIntro() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = pinRef.current;

      if (!el || !desktop.matches) {
        setProgress(0);
        return;
      }

      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) {
        setProgress(0);
        return;
      }

      setProgress(clamp(-el.getBoundingClientRect().top / range));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    desktop.addEventListener('change', update);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      desktop.removeEventListener('change', update);
    };
  }, []);

  // 이미지가 화면을 덮어가는 동안 타이틀을 흰색으로 전환
  const colorT = clamp((progress - 0.25) / 0.5);
  const accentColor = mixColor([254, 107, 0], [255, 255, 255], colorT);
  const inkColor = mixColor([51, 51, 51], [255, 255, 255], colorT);
  const titleHidden = progress >= 0.995;

  return (
    <>
      {/* ---------- 데스크톱 (1024px 이상) ---------- */}
      <div
        aria-hidden={titleHidden}
        style={{ opacity: titleHidden ? 0 : 1 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-10 hidden h-screen flex-col items-center justify-center px-5 text-center transition-opacity duration-300 lg:flex"
      >
        <p className="t-hero" style={{ color: accentColor }}>
          {HERO.en1} <span style={{ color: inkColor }}>{HERO.en2}</span>
        </p>
        <p className="t-title-md mt-2.5" style={{ color: inkColor }}>
          {HERO.ko}
        </p>
        <p className="t-dec-01 mt-5" style={{ color: inkColor }}>
          {HERO.desc.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="hidden lg:block">
        {/* 타이틀이 머무르는 구간 (원본 .section--main) */}
        <div className="h-[calc(100vh-200px)]" aria-hidden="true" />

        {/* 스크롤 핀 구간 (원본 .section--intro, GSAP end: "+=1000") */}
        <div ref={pinRef} className="relative h-[calc(100vh+1000px)]">
          <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
            <div
              // 스크롤 진행률에 따라 매 프레임 계산되는 값이라 인라인 스타일을 사용한다.
              style={{
                width: `${START_WIDTH_VW + (100 - START_WIDTH_VW) * progress}vw`,
                height: `calc(${START_HEIGHT_VW * (1 - progress)}vw + ${100 * progress}vh)`,
              }}
              className="relative overflow-hidden"
            >
              <Image
                src="/images/main/main-intro.jpg"
                alt="장인의공간 메인 이미지"
                fill
                priority
                sizes="(min-width: 1024px) 100vw, 0px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- 모바일 / 태블릿 (1024px 미만) ---------- */}
      <div className="lg:hidden">
        <div className="my-25 px-5 text-center md:my-50">
          <p className="t-hero text-brand">
            {HERO.en1} <span className="text-ink">{HERO.en2}</span>
          </p>
          {/* 원본 .section--main .title-bx 는 768px 미만에서 한 단계 작은 크기를 쓴다 */}
          <p className="t-title-md mt-2.5 text-[1.25rem] md:text-[1.5rem]">{HERO.ko}</p>
          <p className="t-dec-01 mt-5 text-[1.125rem] md:text-[1.25rem]">
            {HERO.desc.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className="relative aspect-[1440/2000] w-full overflow-hidden">
          <Image
            src="/images/main/m-main-intro.jpg"
            alt="장인의공간 메인 이미지"
            fill
            priority
            sizes="(min-width: 1024px) 0px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
