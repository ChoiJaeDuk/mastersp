/**
 * 수행과제 페이지 (Server Component)
 * 원본: kor/project/project.html
 *
 * 원본 마크업(.sc--project .title-bx / .project-bg / .project-wrap)을 그대로 사용한다.
 */
import type { Metadata } from 'next';

import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

import ProjectTabs from './components/ProjectTabs';
import { selectProjectList } from './data';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-3')!;

export const metadata: Metadata = {
  title: `${NAV.label} | ${COMPANY_INFO.name}`,
  description: '(주)장인의공간이 수행한 개발 · 연구 프로젝트 내역입니다.',
};

/** 목록을 DB 에서 읽으므로 요청 시점에 렌더링한다. */
export const dynamic = 'force-dynamic';

/** 탭별 좌측 고정 문구 (원본 .fix-title-bx) */
const TAB_INTROS = [
  {
    title: '전력시장의 혁신을\n향한 도전',
    desc: '최신 기술과 전문 지식을 바탕으로 안정적이고\n효율적인 전력 공급을 목표로 하고 있습니다.',
  },
  {
    title: '전력시장의 내일을\n위한 준비',
    desc: '전력시장 시뮬레이션, 재생에너지 예측 등을 통해\n지속 가능한 전력 공급과 효율성을 높이고 있습니다.',
  },
];

export default async function ProjectPage() {
  const projects = await selectProjectList();

  return (
    <>
      <SubVisual titleEn={NAV.labelEn} />

      <main className="main" id="contents">
        <section className="sc--project">
          <div className="sub-container">
            <Reveal className="title-bx">
              <p className="info--title tg-ani">
                <span>
                  미래를 밝히는 기술의 도약으로
                  <br className="hidden md:block" />
                  전력시장의 내일을 준비합니다.
                </span>
              </p>
              <p className="dec--03 mt-5 lg:mt-10">
                장인의공간은 지속 가능한 에너지 공급을 목표로
                <br />
                다양한 연구와 개발 프로젝트를 수행하고 있습니다.
              </p>
            </Reveal>

            <Reveal>
              <div className="project-bg" />
            </Reveal>

            <ProjectTabs projects={projects} intros={TAB_INTROS} />
          </div>
        </section>
      </main>
    </>
  );
}
