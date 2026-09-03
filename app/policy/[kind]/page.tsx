/**
 * 홈페이지 정책 페이지 (Server Component)
 * 원본: kor/policy/privacy.html, kor/policy/email-security.html
 *
 * 본문은 관리자에서 관리하는 TBL_HP_TERM 에서 읽는다.
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
    <main id="contents" className="overflow-x-clip">
      <SubVisual titleEn={term.labelEn} titleKo={term.label} />

      <section className="py-20 lg:py-30">
        <div className="site-container">
          {content ? (
            // 본문은 관리자가 등록한 HTML 이다.
            <div
              className="policy-content text-[0.9375rem] leading-relaxed text-shell"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-[0.9375rem] text-shell">등록된 내용이 없습니다.</p>
          )}
        </div>
      </section>
    </main>
  );
}
