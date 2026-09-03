/**
 * 전력IT 페이지 (Server Component)
 * 원본: kor/strategy/strategy.html
 *
 * 원본은 type--01 ~ type--05 가 서로 다른 레이아웃이라(좌우 배치·전폭 이미지·원형 스텝)
 * 공통 루프로 뭉치지 않고 원본 마크업 그대로 하나씩 옮겼다.
 * 본문 문구는 lib/content/strategy.ts 에 있다.
 */
import type { Metadata } from 'next';

import FixNav from '@/components/layout/FixNav';
import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { STRATEGY_SECTIONS } from '@/lib/content/strategy';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-4')!;

export const metadata: Metadata = {
  title: `${NAV.label} | ${COMPANY_INFO.name}`,
  description: '전력시장, 수요반응, HEMS/BEMS, Microgrid, Smart Grid 관련 사업 소개',
};

const [POWER, DR, EMS, MICROGRID, SMARTGRID] = STRATEGY_SECTIONS;

/** 섹션 제목 (원본 .sub-title-bx) */
function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <Reveal className="sub-title-bx">
      <p className="title">{label}</p>
      <p className="info--title whitespace-pre-line">{title}</p>
    </Reveal>
  );
}

/** 장인의공간 관련업무 (원본 .bottom-bx .txt-bx) */
function RelatedWork({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="txt-bx sub-container">
      <p className="type--title">장인의공간 관련업무</p>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`dec--03 whitespace-pre-line${index > 0 ? ' mt-5 lg:mt-8' : ''}`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** 문단 묶음 */
function Paragraphs({ block }: { block: (typeof STRATEGY_SECTIONS)[number]['blocks'][number] }) {
  return (
    <>
      {block.paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`whitespace-pre-line ${
            block.lead && index === 0 ? 'dec--01 font-weight-medium' : 'dec--03'
          }${index > 0 ? ' mt-5 lg:mt-8' : ''}`}
        >
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default function StrategyPage() {
  return (
    <>
      <SubVisual titleEn={NAV.labelEn} />
      <FixNav items={NAV.children} variant="en-pd-nav" />

      <main className="main" id="contents">
        <section className="sc--strategy">
          {/* type--01 전력시장 */}
          <div className="type--01 cm--type" id={POWER.id}>
            <div className="sub-container">
              <SectionTitle label={POWER.label} title={POWER.title} />

              <div className="top-bx">
                <Reveal animation="fade-right" className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={POWER.blocks[0].image} alt={POWER.blocks[0].imageAlt} />
                </Reveal>
                <Reveal animation="fade-left" className="txt-bx">
                  <Paragraphs block={POWER.blocks[0]} />
                </Reveal>
              </div>

              <div className="center-bx">
                <Reveal animation="fade-right" className="txt-bx">
                  <Paragraphs block={POWER.blocks[1]} />
                </Reveal>
                <Reveal animation="fade-left" className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={POWER.blocks[1].image} alt={POWER.blocks[1].imageAlt} />
                </Reveal>
              </div>
            </div>

            <div className="bottom-bx">
              <Reveal className="img-bx">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POWER.wideImage} alt="" />
              </Reveal>
              <Reveal>
                <RelatedWork paragraphs={POWER.related} />
              </Reveal>
            </div>
          </div>

          {/* type--02 수요반응 */}
          <div className="sub-sc type--02" id={DR.id}>
            <div className="sub-container cm--type">
              <SectionTitle label={DR.label} title={DR.title} />

              <div className="top-bx">
                <Reveal animation="fade-right" className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={DR.blocks[0].image} alt={DR.blocks[0].imageAlt} />
                </Reveal>
                <Reveal animation="fade-left" className="txt-bx">
                  <Paragraphs block={DR.blocks[0]} />
                </Reveal>
              </div>

              <div className="center-bx">
                <Reveal animation="fade-right" className="txt-bx">
                  <Paragraphs block={DR.blocks[1]} />
                </Reveal>
                <Reveal animation="fade-left" className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={DR.blocks[1].image} alt={DR.blocks[1].imageAlt} />
                </Reveal>
              </div>
            </div>

            <div className="bottom-bx">
              <Reveal className="img-bx">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={DR.wideImage} alt="" />
              </Reveal>
              <Reveal>
                <RelatedWork paragraphs={DR.related} />
              </Reveal>
            </div>
          </div>

          {/* type--03 HEMS / BEMS */}
          <div className="sub-sc type--03" id={EMS.id}>
            <div className="sub-container">
              <div className="left-bx">
                <Reveal animation="fade-right" className="sub-title-bx">
                  <p className="title">{EMS.label}</p>
                  <p className="info--title whitespace-pre-line">{EMS.title}</p>
                  <div className="mt-5 lg:mt-8">
                    <Paragraphs block={EMS.blocks[0]} />
                  </div>

                  <div className="bottom-bx">
                    <p className="type--title">장인의공간 관련업무</p>
                    {EMS.related.map((paragraph, index) => (
                      <p
                        key={index}
                        className={`dec--03 whitespace-pre-line${index > 0 ? ' mt-5 lg:mt-8' : ''}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Reveal>
              </div>

              <Reveal animation="fade-left" className="right-bx">
                <div className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={EMS.blocks[0].image} alt={EMS.blocks[0].imageAlt} />
                </div>
              </Reveal>
            </div>
          </div>

          {/* type--04 Microgrid */}
          <div className="sub-sc type--04" id={MICROGRID.id}>
            <div className="sub-container">
              <div className="text-bx">
                <Reveal className="sub-title-bx">
                  <p className="title">{MICROGRID.label}</p>
                  <p className="info--title whitespace-pre-line">{MICROGRID.title}</p>
                  <div className="mt-5 lg:mt-8">
                    <Paragraphs block={MICROGRID.blocks[0]} />
                  </div>
                </Reveal>
              </div>

              <Reveal className="bottom-bx">
                <div className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={MICROGRID.wideImage} alt="" />
                </div>
                <div className="txt-bx">
                  <p className="type--title">장인의공간 관련업무</p>
                  {MICROGRID.related.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`dec--03 whitespace-pre-line${index > 0 ? ' mt-5 lg:mt-8' : ''}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* type--05 Smart Grid */}
          <div className="sub-sc type--05" id={SMARTGRID.id}>
            <div className="sub-container">
              <div className="text-bx">
                <Reveal className="sub-title-bx">
                  <p className="title">{SMARTGRID.label}</p>
                  <p className="info--title whitespace-pre-line">{SMARTGRID.title}</p>
                  <div className="mt-5 lg:mt-8">
                    <Paragraphs block={SMARTGRID.blocks[0]} />
                  </div>
                </Reveal>
              </div>

              {SMARTGRID.steps ? (
                <div className="step-bx">
                  <Reveal>
                    <p className="step-title">{SMARTGRID.steps.title}</p>
                  </Reveal>

                  {/* 원본은 원(li)과 화살표(li.arrow-bx)를 형제 li 로 번갈아 놓는다. */}
                  <ul className="step-item">
                    {SMARTGRID.steps.items.flatMap((item, index) => {
                      const circle = (
                        <li key={item.step}>
                          <Reveal animation="fade-right" delay={index * 150}>
                            <div className={`circle-bx circle0${index + 1}`}>
                              <div className="txt-bx">
                                <p className="title--md">{item.step}</p>
                                <p className="term">{item.term}</p>
                                <i className="circle-w" />
                                <p className="dec--03 font-weight-normal whitespace-pre-line">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </Reveal>
                        </li>
                      );

                      if (index === 0) return [circle];

                      return [
                        <li key={`${item.step}-arrow`} className="arrow-bx" aria-hidden>
                          <i className="xi-arrow-right" />
                        </li>,
                        circle,
                      ];
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <Reveal className="bottom-bx">
              <div className="img-bx">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SMARTGRID.wideImage} alt="" />
              </div>
              <RelatedWork paragraphs={SMARTGRID.related} />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
