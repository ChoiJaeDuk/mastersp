import Image from 'next/image';
import Link from 'next/link';

import Reveal from '@/components/ui/Reveal';

const VALUE_CARDS = [
  {
    icon: '/images/main/professional-icon.png',
    width: 37,
    height: 37,
    en: 'Professional',
    title: '전문성',
    desc: [
      '각종 알고리즘 분석 및 구현을 통한',
      '연구 결과와 IT 개발 간의 이상적인',
      '접목을 지향합니다.',
    ],
  },
  {
    icon: '/images/main/service-icon.png',
    width: 35,
    height: 35,
    en: 'Service',
    title: '고객중심',
    desc: [
      '전문 지식을 바탕으로 요구사항의',
      '철저한 분석을 통하여 사용자 중심의',
      '서비스를 제공합니다.',
    ],
  },
  {
    icon: '/images/main/future-icon.png',
    width: 34,
    height: 37,
    en: 'Future',
    title: '미래산업',
    desc: [
      '빅데이터, 머신 러닝 엔진 개발 등',
      '4차산업 기술을 적극적으로 도입하여',
      '미래 산업에 대비합니다.',
    ],
  },
];

/** 원본 .section--innovation (Server Component) */
export default function InnovationSection() {
  return (
    <section className="mt-20 lg:mt-[16.25rem]">
      {/* 상단 배경 타이틀 밴드 */}
      <div className="bg-[url('/images/main/innovationo-bg.jpg')] bg-cover bg-center bg-no-repeat text-center text-white">
        <div className="site-container">
          <div className="py-20 xxl:py-[17.5rem]">
            <Reveal>
              <p className="t-display">
                <span className="tri-deco">Growth Through Innovation</span>
              </p>
            </Reveal>
            <Reveal>
              <p className="t-title-md mt-10 lg:mt-15">장인의 공간은 AI 및 디지털 기술을 통해</p>
            </Reveal>
            <Reveal>
              <p className="t-dec-01 mt-5 lg:mt-2.5">
                지속 가능한 성장을 위한 기술을 도입하고, 전력시장의 효율성을 극대화합니다.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* 핵심 가치 3종 */}
      <div className="site-container">
        <div className="relative flex flex-col items-center gap-10 py-20 text-center lg:flex-row lg:justify-center lg:gap-0 lg:py-40 xxl:pt-[18.75rem] xxl:pb-[23.4375rem] xxl:pl-[21.875rem] xxl:text-left">
          {/* 원본 .info-item01:before 주황색 세로 바 */}
          <span
            aria-hidden="true"
            className="absolute top-[-45px] left-0 hidden h-[710px] w-[30px] bg-brand xxl:block"
          />

          {VALUE_CARDS.map((card, index) => (
            <Reveal
              key={card.en}
              animation="fade-right"
              delay={index * 200}
              className="w-full lg:flex-1"
            >
              <div className="flex flex-col items-center xxl:flex-row xxl:items-start xxl:gap-[0.9375rem]">
                <div className="shrink-0">
                  <Image
                    src={card.icon}
                    alt=""
                    width={card.width}
                    height={card.height}
                    className="h-auto w-[25px] lg:w-auto"
                  />
                </div>
                <div>
                  <p className="t-dec-01 font-normal">{card.en}</p>
                  <p className="t-info-title my-5 lg:my-[1.5625rem]">{card.title}</p>
                  <p className="t-dec-03">
                    {card.desc.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 이미지 + 텍스트 교차 블록 */}
      <div className="mx-auto max-w-[1920px] px-5 xxl:px-0">
        {/* 01 : 텍스트 좌 / 이미지 우 */}
        <div className="flex flex-col items-center gap-20 xxl:flex-row xxl:gap-0">
          <Reveal className="w-full text-center xxl:flex-1 xxl:text-left">
            <div className="xxl:ml-40">
              <p className="t-title-lg">
                유연하고 지속적으로
                <br />
                변화하는 에너지 시장에
                <br />
                대응합니다
              </p>
              <div className="mt-5 lg:mt-20">
                <p className="t-dec-01 font-medium">
                  국산화 및 해외 판매 M-Core는
                  <br />
                  국내 시장 특성에 최적화된 전력시장 분석 시뮬레이터입니다.
                </p>
                <p className="t-dec-03 mt-5 lg:mt-10">
                  한국전력공사, 전력거래소, 발전회사 등 많은 전력 관련 회사들이 사용하고 있으며,
                  <br />
                  시장 동향 분석, 가격 분석, 수익 분석 등의 용도로 활용되고 있습니다.
                </p>
                <Link href="/product/m-core" className="more-btn mt-5 lg:mt-[1.875rem]">
                  More View
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal animation="fade-left" className="w-full xxl:flex-1">
            <div className="flex items-center justify-center xxl:justify-end">
              <Image
                src="/images/main/info-img01.jpg"
                alt="에너지 시장 대응"
                width={559}
                height={700}
                className="h-auto w-full max-w-[559px]"
              />
            </div>
          </Reveal>
        </div>

        {/* 02 : 이미지 좌 / 텍스트 우 */}
        <div className="relative mt-20 flex flex-col items-center gap-20 xxl:mt-50 xxl:flex-row xxl:gap-0">
          {/* 데코 삼각형 (1400px 이상) */}
          <Image
            src="/images/main/triangle-m.png"
            alt=""
            width={183}
            height={203}
            aria-hidden="true"
            className="absolute top-[-30px] right-40 -z-10 hidden xxl:block"
          />
          <Image
            src="/images/main/triangle-s2.png"
            alt=""
            width={119}
            height={73}
            aria-hidden="true"
            className="absolute top-[15.625rem] right-25 z-10 hidden xxl:block"
          />

          <Reveal animation="fade-right" className="w-full xxl:flex-1">
            <div className="relative pb-[120px] xxl:pb-[240px]">
              <Image
                src="/images/main/info-img02.jpg"
                alt="전력시장의 미래"
                width={960}
                height={700}
                className="h-auto w-full"
              />
              <Image
                src="/images/main/info-img02-1.jpg"
                alt=""
                width={400}
                height={380}
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 z-10 h-auto w-[200px] -translate-x-1/2 xxl:w-[400px]"
              />
            </div>
          </Reveal>

          <Reveal className="w-full text-center xxl:flex-1 xxl:text-left">
            <div className="xxl:mr-40 xxl:pl-[9.375rem]">
              <p className="t-title-lg">
                전력시장의
                <br />
                미래를 이끌어갑니다
              </p>
              <div className="mt-5 lg:mt-20">
                <p className="t-dec-03">
                  전력시장 제도 개선과 예측을 통해
                  <br />더 효율적이고 안정적인 전력 공급을 목표로 하고 있습니다.
                </p>
                <Link href="/strategy" className="more-btn mt-5 lg:mt-[1.875rem]">
                  More View
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 03 : 텍스트 좌 / 이미지 우 */}
        <div className="site-container mt-20 flex flex-col-reverse items-center gap-20 xxl:mt-70 xxl:flex-row xxl:pt-[240px]">
          <Reveal className="w-full text-center xxl:flex-1 xxl:text-left">
            <p className="t-title-lg">
              고객의 성공을
              <br />
              먼저 생각합니다
            </p>
            <div className="mt-5 lg:mt-20">
              <p className="t-dec-01 font-medium">
                고객의 요구사항을 철저히 분석하여 사용자 중심의 서비스를 제공합니다.
              </p>
              <p className="t-dec-03 mt-5 lg:mt-10">
                최고의 전문 인력들이 One-Team으로 구성되어 고객사의 다양한
                <br className="hidden xxl:block" />
                요구사항에 맞춰 Web•Stand-Alone 기반 시스템 개발, 빅데이터, 머신 러닝, AI 학습 시스템
                <br className="hidden xxl:block" />
                구현 등 맞춤형 솔루션을 구축합니다.
              </p>
            </div>
          </Reveal>

          <Reveal animation="fade-left" className="w-full xxl:flex-1">
            <div className="flex items-center justify-center xxl:justify-end">
              <Image
                src="/images/main/info-img03.jpg"
                alt="고객 중심 솔루션"
                width={800}
                height={700}
                className="h-auto w-full max-w-[800px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
