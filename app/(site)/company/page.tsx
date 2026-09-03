/**
 * 회사소개 페이지 (Server Component)
 * 원본: kor/company/company.html
 *
 * 원본 마크업/클래스(.sc--company .greeting / .history-item / .come …)를 그대로 사용한다.
 * 스타일은 styles/legacy-sub.css (원본 sub.min.css 원문)가 담당한다.
 * 원본의 data-aos / wow 는 Reveal 컴포넌트로 대체했다.
 */
import type { Metadata } from 'next';

import FixNav from '@/components/layout/FixNav';
import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { COMPANY_INFO, NAV_ITEMS, OFFICES } from '@/lib/navigation';

import KakaoMap from './components/KakaoMap';
import { selectHistoryList } from './data';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-1')!;

export const metadata: Metadata = {
  title: `${NAV.label} | ${COMPANY_INFO.name}`,
  description: '(주)장인의공간의 인사말, 연혁, 조직도, 오시는 길을 안내합니다.',
};

/** 연혁을 DB 에서 읽으므로 요청 시점에 렌더링한다. */
export const dynamic = 'force-dynamic';

/** 오시는 길 연락처 (원본 .map-info-item) */
const CONTACT_ITEMS = [
  {
    icon: '/images/sub/icon01.png',
    alt: '주소아이콘',
    label: '주소',
    rows: OFFICES.map((office) => ({ name: office.name, value: office.address })),
    addrRight: false,
  },
  {
    icon: '/images/sub/icon02.png',
    alt: '이메일아이콘',
    label: '이메일',
    rows: [{ name: '', value: COMPANY_INFO.email }],
    addrRight: false,
  },
  {
    icon: '/images/sub/icon03.png',
    alt: '전화아이콘',
    label: '전화',
    rows: OFFICES.filter((office) => office.tel).map((office) => ({
      name: office.name,
      value: office.tel,
    })),
    addrRight: true,
  },
  {
    icon: '/images/sub/icon04.png',
    alt: '팩스아이콘',
    label: '팩스',
    rows: OFFICES.filter((office) => office.fax).map((office) => ({
      name: office.name,
      value: office.fax,
    })),
    addrRight: true,
  },
];

export default async function CompanyPage() {
  const historyYears = await selectHistoryList();

  return (
    <>
      <SubVisual titleEn={NAV.labelEn} />
      <FixNav items={NAV.children} variant="companyNav" />

      <main className="main" id="contents">
        <section className="sc--company">
          <div className="sub-container">
            {/* 인사말 */}
            <div className="greeting" id="greeting">
              <div className="top-bx">
                <Reveal animation="fade-right" className="sub-title-bx">
                  <p className="title">인사말</p>
                  <p className="info--title">CEO&apos;S MESSAGE</p>
                  <p className="dec--01 mt-10 lg:mt-25 font-weight-medium">
                    안녕하십니까?
                    <br />
                    장인의공간 대표 {COMPANY_INFO.ceo}입니다.
                  </p>
                  <p className="dec--03 mt-8 lg:mt-15">
                    장인의공간은 전력시장 컨설팅과 최적화 솔루션을 개발하기 위해
                    <br /> 2007년에 설립되었습니다.
                  </p>
                </Reveal>

                <Reveal animation="fade-left" className="img-bx">
                  {/* 원본이 <img width:100%> 라 next/image 대신 그대로 둔다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/sub/company-img01.jpg" alt="company-img01" />
                </Reveal>
              </div>

              <Reveal className="center-bx">
                <p className="dec--03">
                  장인의공간은 그동안 전력시장 가격예측, 발전소의 이용률 예측, 시장의 각종 제도 설계
                  등<br />
                  다양한 분야의 컨설팅에 참여한 경험이 있으며, 국내의 기술력이 충분함에도 불구하고
                  해외 의존도가 높은
                  <br />
                  최적화 솔루션의 국산화를 목표로 현재 연간 · 일간 발전계획 엔진을 보유하고 이를
                  이용한 시뮬레이터를 통하여
                  <br />
                  전력시장 예측 컨설팅도 수행하고 있습니다.
                </p>
              </Reveal>

              <div className="bottom-bx">
                <Reveal animation="fade-right" className="img-bx">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/sub/company-img02.jpg" alt="company-img02" />
                </Reveal>

                <Reveal animation="fade-left" className="txt-bx">
                  <p className="dec--03">
                    또한 다양한 개발 언어 기반의 웹 어플리케이션 및 소프트웨어 개발을
                    <br className="hidden xxl:block" />
                    통하여 고객사들의 다양한 니즈를 만족시킬수 있는 SI(System Integration)
                    <br className="hidden xxl:block" />
                    사업과 솔루션 개발과 더불어 4차 산업의 핵심 기술인 빅데이터 및 머신러닝,
                    <br className="hidden xxl:block" />
                    AI 학습 시스템 구현 사업도 함께 진행하고 있습니다.
                  </p>
                  <p className="dec--03 mt-5 lg:mt-10">
                    저희 기술을 바탕으로 여러분의 좋은 파트너가 될 수 있기를 바랍니다.
                  </p>
                  <p className="dec--03 mt-5 lg:mt-10 sm-bold">감사합니다.</p>

                  <ul className="sign-bx mt-10 lg:mt-20">
                    <li>
                      <p className="dec--03 sm-bold">대표이사</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/sub/ceo-sign01.png" alt={`${COMPANY_INFO.ceo} 서명`} />
                    </li>
                  </ul>
                </Reveal>
              </div>
            </div>

            {/* 연혁 */}
            <div className="sub-sc history" id="history">
              <Reveal className="sub-title-bx">
                <p className="title">연혁</p>
                <p className="info--title">장인의공간이 걸어온 길</p>
              </Reveal>

              <div className="history-list">
                {historyYears.length > 0 ? (
                  historyYears.map((year, index) => (
                    // 원본은 홀수 번째 항목에 .reverse 를 붙여 좌우 지그재그로 배치한다.
                    <Reveal
                      key={year.year}
                      className={`history-item${index % 2 !== 0 ? ' reverse' : ''}`}
                    >
                      <div className="info-wrap">
                        <div className="info-bx">
                          <div className="year-bx">
                            <p className="tit">{year.year}</p>
                          </div>
                          <ul className="info-item">
                            {year.entries.map((entry, entryIndex) => (
                              <li key={entryIndex}>
                                <p className="date">{entry.month}</p>
                                <p className="dec">{entry.content}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div />
                    </Reveal>
                  ))
                ) : (
                  <p className="dec--03 text-center">등록된 연혁이 없습니다.</p>
                )}
              </div>

              <Reveal>
                <div className="history-bg" />
              </Reveal>
            </div>

            {/* 조직도 */}
            <div className="sub-sc chart" id="chart">
              <Reveal className="sub-title-bx">
                <p className="title">조직도</p>
                <p className="info--title">장인의공간의 팀워크</p>
              </Reveal>

              <Reveal className="row-scrollwrap">
                <div className="chart-img mt-15 lg:mt-25">
                  {/* 원본은 데스크톱/모바일 이미지를 나눠 쓴다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sub/organization.png"
                    className="hidden w-full lg:block"
                    alt="조직도"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sub/m-organization.png"
                    className="block w-full lg:hidden"
                    alt="조직도"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* 오시는 길 */}
          <div className="sub-sc come" id="come">
            <Reveal className="sub-title-bx sub-container">
              <p className="title">오시는 길</p>
              <p className="info--title">장인의공간 안내</p>
            </Reveal>

            <Reveal>
              <KakaoMap />
            </Reveal>

            <Reveal className="map-info sub-container">
              <p className="info--title">Contact</p>
              <ul className="map-info-item">
                {CONTACT_ITEMS.map((item) => (
                  <li key={item.label}>
                    <div className="left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.icon} alt={item.alt} />
                      <p className="dec--01 font-weight-medium">{item.label}</p>
                    </div>
                    <div className={item.addrRight ? 'right addr-right' : 'right'}>
                      {item.rows.map((row, index) => (
                        <p key={index} className="dec--03">
                          {row.name ? <span className="addr-tit">{row.name}</span> : null}
                          {row.value}
                        </p>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="map-bg">
              <div className="sub-container">
                <div className="txt-bx">
                  <p className="bg-txt">
                    장인의공간은 고객사의 다양한 요구사항을
                    <br className="hidden sm:block" />
                    수용하기 위한 업무 운영 시스템 구축을 전문으로 하는
                    <br className="hidden sm:block" />
                    소프트웨어 개발 회사입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
