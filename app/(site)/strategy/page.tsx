/**
 * 전력IT 페이지 (Server Component)
 * 원본: kor/strategy/strategy.html
 */
import type { Metadata } from 'next';
import Image from 'next/image';

import SectionTitle from '@/components/layout/SectionTitle';
import SubNav from '@/components/layout/SubNav';
import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { STRATEGY_SECTIONS } from '@/lib/content/strategy';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-4')!;

export const metadata: Metadata = {
  title: `${NAV.label} | ${COMPANY_INFO.name}`,
  description: '전력시장, 수요반응, HEMS/BEMS, Microgrid, Smart Grid 관련 사업 소개',
};

/** 장인의공간 관련업무 블록 (원본 .bottom-bx .txt-bx) */
function RelatedWork({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Reveal className="mt-10 lg:mt-14">
      <p className="t-dec-01 font-semibold text-brand">장인의공간 관련업무</p>
      <div className="mt-4 space-y-4 lg:mt-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="t-dec-03 whitespace-pre-line text-shell">
            {paragraph}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

export default function StrategyPage() {
  return (
    <main id="contents" className="overflow-x-clip">
      <SubVisual titleEn={NAV.labelEn} titleKo={NAV.label} />
      <SubNav items={NAV.children} />

      {STRATEGY_SECTIONS.map((section, sectionIndex) => (
        <section
          key={section.id}
          id={section.id}
          // 고정 서브 네비게이션에 제목이 가리지 않도록 여백을 둔다.
          className={`scroll-mt-24 py-20 lg:py-30 ${sectionIndex % 2 === 1 ? 'bg-[#fafafa]' : ''}`}
        >
          <div className="site-container">
            <SectionTitle label={section.label} title={section.title} />

            <div className="mt-10 space-y-14 lg:mt-16 lg:space-y-20">
              {section.blocks.map((block, blockIndex) => (
                <div
                  key={blockIndex}
                  className={`grid items-center gap-8 lg:gap-16 ${
                    block.image ? 'lg:grid-cols-2' : ''
                  }`}
                >
                  {block.image ? (
                    <Reveal
                      animation={blockIndex % 2 === 0 ? 'fade-right' : 'fade-left'}
                      className={blockIndex % 2 === 0 ? '' : 'lg:order-2'}
                    >
                      <Image
                        src={block.image}
                        alt={block.imageAlt ?? ''}
                        width={1200}
                        height={800}
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="h-auto w-full"
                      />
                    </Reveal>
                  ) : null}

                  <Reveal animation={blockIndex % 2 === 0 ? 'fade-left' : 'fade-right'}>
                    <div className="space-y-5 lg:space-y-8">
                      {block.paragraphs.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className={`whitespace-pre-line ${
                            block.lead && paragraphIndex === 0
                              ? 't-dec-01 font-medium text-ink'
                              : 't-dec-03 text-shell'
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>

            {/* 스마트그리드 구축 시나리오 */}
            {section.steps ? (
              <div className="mt-14 lg:mt-20">
                <Reveal>
                  <p className="t-dec-01 text-center font-semibold text-ink">
                    {section.steps.title}
                  </p>
                </Reveal>
                <ul className="mt-8 grid gap-6 md:grid-cols-3 lg:mt-12">
                  {section.steps.items.map((item, index) => (
                    <li key={item.step}>
                      <Reveal delay={index * 120}>
                        <div className="flex h-full flex-col items-center border border-[#e5e5e5] bg-white px-6 py-10 text-center">
                          <p className="t-dec-01 font-bold text-brand">{item.step}</p>
                          <p className="mt-1 text-[0.875rem] text-shell">{item.term}</p>
                          <span aria-hidden className="my-5 h-px w-10 bg-[#ddd]" />
                          <p className="t-dec-03 whitespace-pre-line text-shell">{item.desc}</p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* 하단 전폭 이미지 */}
          {section.wideImage ? (
            <Reveal className="mt-14 lg:mt-20">
              <div
                role="presentation"
                className="h-50 bg-cover bg-center bg-no-repeat lg:h-[25rem]"
                // 섹션마다 다른 이미지라 인라인 스타일로 지정한다.
                style={{ backgroundImage: `url('${section.wideImage}')` }}
              />
            </Reveal>
          ) : null}

          <div className="site-container">
            <RelatedWork paragraphs={section.related} />
          </div>
        </section>
      ))}
    </main>
  );
}
