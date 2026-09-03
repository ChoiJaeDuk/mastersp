/**
 * 관리자 홈 (Server Component)
 *
 * 로그인 직후 도착하는 화면. 처리해야 할 문의 건수만 간단히 보여준다.
 */
import Link from 'next/link';

import { isDbConfigured, queryOne, SQL } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Summary = {
  totalCount: number;
  waitingCount: number;
  historyCount: number;
  projectCount: number;
};

/** 대시보드 요약 조회. DB 미연결이면 0 으로 채운다. */
async function selectSummary(): Promise<Summary | null> {
  if (!isDbConfigured()) return null;

  try {
    const row = await queryOne<{
      TOTAL_CNT: number;
      WAITING_CNT: number;
      HISTORY_CNT: number;
      PROJECT_CNT: number;
    }>(SQL`
      SELECT (SELECT COUNT(*) FROM TBL_HP_INQUIRY WHERE DEL_YN = 'N') AS TOTAL_CNT,
             (SELECT COUNT(*) FROM TBL_HP_INQUIRY WHERE DEL_YN = 'N' AND PRCS_STS_CD = 'RECV') AS WAITING_CNT,
             (SELECT COUNT(*) FROM TBL_HP_HISTORY WHERE USE_YN = 'Y') AS HISTORY_CNT,
             (SELECT COUNT(*) FROM TBL_HP_PROJECT WHERE USE_YN = 'Y') AS PROJECT_CNT
    `);

    if (!row) return null;

    return {
      totalCount: row.TOTAL_CNT,
      waitingCount: row.WAITING_CNT,
      historyCount: row.HISTORY_CNT,
      projectCount: row.PROJECT_CNT,
    };
  } catch (error) {
    console.error('Failed to fetch admin summary :', error);
    return null;
  }
}

export default async function AdminHomePage() {
  const summary = await selectSummary();

  const cards = [
    {
      label: '미답변 문의',
      value: summary?.waitingCount,
      href: '/admin/hp/inquiry-mng',
      highlight: true,
    },
    { label: '전체 문의', value: summary?.totalCount, href: '/admin/hp/inquiry-mng' },
    { label: '노출 중인 연혁', value: summary?.historyCount, href: '/admin/hp/history-mng' },
    { label: '노출 중인 수행과제', value: summary?.projectCount, href: '/admin/hp/project-mng' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">관리자 홈</h1>
      <p className="mt-1 text-sm text-shell">
        좌측 메뉴에서 홈페이지 콘텐츠와 시스템 설정을 관리할 수 있습니다.
      </p>

      {!summary ? (
        <p className="mt-6 border border-[#ffd9bf] bg-[#fff4ec] p-4 text-sm text-ink">
          데이터베이스에 연결되어 있지 않습니다. <code>.env.local</code> 의 DB 접속 정보를 채운 뒤
          <code> db/schema.sql</code> 과 <code>db/seed.sql</code> 을 실행해 주세요.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <li key={card.label}>
              <Link
                href={card.href}
                className="block bg-white p-5 shadow-sm transition-colors hover:bg-[#fff8f3]"
              >
                <p className="text-sm text-shell">{card.label}</p>
                <p
                  className={`mt-2 text-3xl font-bold ${card.highlight ? 'text-brand' : 'text-ink'}`}
                >
                  {card.value ?? 0}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
