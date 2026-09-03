/**
 * 홈페이지 정책 페이지 (Server Component)
 * 원본: kor/policy/privacy.html · term.html · email-security.html
 *
 * 원본은 세 파일이 본문 인클루드만 다르고 마크업이 같아 하나의 동적 라우트로 합쳤다.
 * 본문은 관리자에서 관리하는 TBL_HP_TERM 에서 읽는다. (원본의 tb_yark)
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import SubVisual from '@/components/layout/SubVisual';
import { COMPANY_INFO } from '@/lib/navigation';

import { selectTermContent, TERM_KINDS, type TermSlug } from '../data';

type PageProps = {
  params: Promise<{ kind: string }>;
};

/** 본문이 DB(관리자 화면)에서 관리되므로 요청 시점에 렌더링한다. */
export const dynamic = 'force-dynamic';

function isTermSlug(value: string): value is TermSlug {
  return value in TERM_KINDS;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kind } = await params;

  if (!isTermSlug(kind)) return {};

  return { title: `${TERM_KINDS[kind].label} | ${COMPANY_INFO.name}` };
}

export default async function PolicyPage({ params }: PageProps) {
  const { kind } = await params;

  if (!isTermSlug(kind)) notFound();

  const term = TERM_KINDS[kind];
  const content = await selectTermContent(kind);

  return (
    <>
      {/* 원본은 $nav_policy_en 이 정의돼 있지 않아 제목이 비어 나온다. 의도대로 Policy 를 넣었다. */}
      <SubVisual titleEn="Policy" />

      <main className="main py-20" id="contents">
        <section className="section">
          <div className="container">
            <div className="sub-title mb-4">
              <h1 className="sub-title__title info--title">{term.label}</h1>
            </div>

            <div className="text-left text-keep text-gray-5 font-weight-light">
              {content ? (
                // 본문은 관리자가 등록한 HTML 이다.
                <div className="dec--04" dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="dec--04">등록된 내용이 없습니다.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
