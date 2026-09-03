/**
 * 수행과제 페이지 (Server Component)
 * 원본: kor/project/project.html
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

export default async function ProjectPage() {
  const projects = await selectProjectList();

  return (
    <main id="contents" className="overflow-x-clip">
      <SubVisual titleEn={NAV.labelEn} titleKo={NAV.label} />

      <section className="py-20 lg:py-30">
        <div className="site-container">
          <Reveal>
            <p className="t-info-title font-display font-bold text-ink">
              미래를 밝히는 기술의 도약으로
              <br className="hidden md:block" /> 전력시장의 내일을 준비합니다.
            </p>
            <p className="t-dec-03 mt-5 text-shell lg:mt-10">
              장인의공간은 지속 가능한 에너지 공급을 목표로
              <br />
              다양한 연구와 개발 프로젝트를 수행하고 있습니다.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:mt-20">
          <div className="h-50 bg-[url('/images/sub/project-bg.jpg')] bg-cover bg-center bg-no-repeat lg:h-[25rem]" />
        </Reveal>

        <div className="site-container mt-16 lg:mt-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <Reveal animation="fade-right">
              <p className="t-title-md font-bold text-ink">
                전력시장의 혁신을
                <br className="hidden lg:block" /> 향한 도전
              </p>
              <p className="t-dec-01 mt-5 font-medium text-shell">
                최신 기술과 전문 지식을 바탕으로 안정적이고
                <br />
                효율적인 전력 공급을 목표로 하고 있습니다.
              </p>
            </Reveal>

            <ProjectTabs projects={projects} />
          </div>
        </div>
      </section>
    </main>
  );
}
