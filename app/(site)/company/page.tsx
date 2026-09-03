/**
 * 회사소개 페이지 (Server Component)
 * 원본: kor/company/company.html — 인사말 / 연혁 / 조직도 / 오시는 길
 *
 * 연혁만 DB(TBL_HP_HISTORY)에서 읽고 나머지는 정적 콘텐츠다.
 */
import type { Metadata } from 'next';
import Image from 'next/image';

import SectionTitle from '@/components/layout/SectionTitle';
import SubNav from '@/components/layout/SubNav';
import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { COMPANY_INFO, NAV_ITEMS, OFFICES } from '@/lib/navigation';

import { selectHistoryList } from './data';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-1')!;

export const metadata: Metadata = {
  title: `${NAV.label} | ${COMPANY_INFO.name}`,
  description: '(주)장인의공간의 인사말, 연혁, 조직도, 오시는 길을 안내합니다.',
};

/** 연혁은 DB 에서 읽으므로 요청 시점에 렌더링한다. */
export const dynamic = 'force-dynamic';

const GREETING_INTRO = [
  '장인의공간은 그동안 전력시장 가격예측, 발전소의 이용률 예측, 시장의 각종 제도 설계 등 다양한 분야의 컨설팅에 참여한 경험이 있으며, 국내의 기술력이 충분함에도 불구하고 해외 의존도가 높은 최적화 솔루션의 국산화를 목표로 현재 연간 · 일간 발전계획 엔진을 보유하고 이를 이용한 시뮬레이터를 통하여 전력시장 예측 컨설팅도 수행하고 있습니다.',
];

const GREETING_OUTRO = [
  '또한 다양한 개발 언어 기반의 웹 어플리케이션 및 소프트웨어 개발을 통하여 고객사들의 다양한 니즈를 만족시킬수 있는 SI(System Integration) 사업과 솔루션 개발과 더불어 4차 산업의 핵심 기술인 빅데이터 및 머신러닝, AI 학습 시스템 구현 사업도 함께 진행하고 있습니다.',
  '저희 기술을 바탕으로 여러분의 좋은 파트너가 될 수 있기를 바랍니다.',
];

/** 오시는 길 연락처 항목 (원본 .map-info-item) */
const CONTACT_ITEMS = [
  {
    icon: '/images/sub/icon01.png',
    label: '주소',
    rows: OFFICES.map((office) => ({ name: office.name, value: office.address })),
  },
  {
    icon: '/images/sub/icon02.png',
    label: '이메일',
    rows: [{ name: '', value: COMPANY_INFO.email }],
  },
  {
    icon: '/images/sub/icon03.png',
    label: '전화',
    rows: OFFICES.filter((office) => office.tel).map((office) => ({
      name: office.name,
      value: office.tel,
    })),
  },
  {
    icon: '/images/sub/icon04.png',
    label: '팩스',
    rows: OFFICES.filter((office) => office.fax).map((office) => ({
      name: office.name,
      value: office.fax,
    })),
  },
];

export default async function CompanyPage() {
  const historyYears = await selectHistoryList();

  return (
    <main id="contents" className="overflow-x-clip">
      <SubVisual titleEn={NAV.labelEn} titleKo={NAV.label} />
      <SubNav items={NAV.children} />

      {/* 인사말 */}
      <section id="greeting" className="scroll-mt-24 py-20 lg:py-30">
        <div className="site-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal animation="fade-right">
              <SectionTitle label="인사말" title="CEO'S MESSAGE" />
              <p className="t-dec-01 mt-8 font-medium text-ink lg:mt-12">
                안녕하십니까?
                <br />
                장인의공간 대표 {COMPANY_INFO.ceo}입니다.
              </p>
              <p className="t-dec-03 mt-5 text-shell lg:mt-8">
                장인의공간은 전력시장 컨설팅과 최적화 솔루션을 개발하기 위해
                <br />
                2007년에 설립되었습니다.
              </p>
            </Reveal>

            <Reveal animation="fade-left">
              <Image
                src="/images/sub/company-img01.jpg"
                alt="장인의공간 사무실"
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="h-auto w-full"
                priority
              />
            </Reveal>
          </div>

          <Reveal className="mt-12 lg:mt-20">
            {GREETING_INTRO.map((paragraph) => (
              <p key={paragraph} className="t-dec-03 text-shell">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
            <Reveal animation="fade-right">
              <Image
                src="/images/sub/company-img02.jpg"
                alt="장인의공간 업무 모습"
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="h-auto w-full"
              />
            </Reveal>

            <Reveal animation="fade-left">
              <div className="space-y-5 lg:space-y-8">
                {GREETING_OUTRO.map((paragraph) => (
                  <p key={paragraph} className="t-dec-03 text-shell">
                    {paragraph}
                  </p>
                ))}
                <p className="t-dec-03 font-semibold text-ink">감사합니다.</p>
              </div>

              <div className="mt-10 flex items-center gap-4 lg:mt-14">
                <p className="t-dec-03 font-semibold text-ink">대표이사</p>
                <Image
                  src="/images/sub/ceo-sign01.png"
                  alt={`${COMPANY_INFO.ceo} 서명`}
                  width={200}
                  height={70}
                  className="h-auto w-32"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 연혁 */}
      <section id="history" className="scroll-mt-24 bg-[#fafafa] py-20 lg:py-30">
        <div className="site-container">
          <SectionTitle label="연혁" title="장인의공간이 걸어온 길" />

          {historyYears.length > 0 ? (
            <ol className="mt-10 space-y-12 lg:mt-16 lg:space-y-16">
              {historyYears.map((year) => (
                <li key={year.year}>
                  <Reveal>
                    <div className="grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10">
                      <p className="t-title-md font-display font-black text-brand">{year.year}</p>
                      <ul className="space-y-3 border-l border-[#ddd] pl-6 lg:pl-10">
                        {year.entries.map((entry, index) => (
                          <li key={index} className="flex gap-4">
                            <span className="w-10 shrink-0 text-[0.9375rem] font-semibold text-ink">
                              {entry.month}
                            </span>
                            <span className="t-dec-03 whitespace-pre-line text-shell">
                              {entry.content}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          ) : (
            <p className="t-dec-03 mt-10 text-shell">등록된 연혁이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 조직도 */}
      <section id="chart" className="scroll-mt-24 py-20 lg:py-30">
        <div className="site-container">
          <SectionTitle label="조직도" title="장인의공간의 팀워크" />

          <Reveal className="mt-10 lg:mt-16">
            {/* 원본은 데스크톱/모바일 이미지를 나눠 쓴다. */}
            <Image
              src="/images/sub/organization.png"
              alt="장인의공간 조직도"
              width={1600}
              height={900}
              sizes="100vw"
              className="hidden h-auto w-full lg:block"
            />
            <Image
              src="/images/sub/m-organization.png"
              alt="장인의공간 조직도"
              width={800}
              height={1200}
              sizes="100vw"
              className="h-auto w-full lg:hidden"
            />
          </Reveal>
        </div>
      </section>

      {/* 오시는 길 */}
      <section id="come" className="scroll-mt-24 bg-[#fafafa] py-20 lg:py-30">
        <div className="site-container">
          <SectionTitle label="오시는 길" title="장인의공간 안내" />

          <Reveal className="mt-10 lg:mt-16">
            <p className="t-info-title font-display font-bold text-ink">Contact</p>
            <ul className="mt-6 border-t border-[#ddd]">
              {CONTACT_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col gap-3 border-b border-[#ddd] py-6 sm:flex-row sm:gap-10"
                >
                  <div className="flex w-full shrink-0 items-center gap-3 sm:w-40">
                    <Image src={item.icon} alt="" width={40} height={40} className="size-8" />
                    <p className="t-dec-01 font-medium text-ink">{item.label}</p>
                  </div>
                  <div className="space-y-2">
                    {item.rows.map((row, index) => (
                      <p key={index} className="t-dec-03 text-shell">
                        {row.name ? (
                          <span className="mr-3 inline-block min-w-16 font-semibold text-ink">
                            {row.name}
                          </span>
                        ) : null}
                        {row.value}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16 lg:mt-24">
          <div className="bg-[url('/images/sub/company-bg.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="site-container py-20 lg:py-30">
              <p className="t-title-md font-semibold text-white">
                장인의공간은 고객사의 다양한 요구사항을
                <br className="hidden sm:block" /> 수용하기 위한 업무 운영 시스템 구축을 전문으로
                하는
                <br className="hidden sm:block" /> 소프트웨어 개발 회사입니다.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
