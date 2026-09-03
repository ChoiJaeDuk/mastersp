/**
 * 회사소개 데이터 조회
 *
 * 레거시: kor/company/company.html 의
 *   select year from tb_history where lantype='1' and viewtype='Y' group by year order by year desc
 *   select month,content from tb_history where year = '...' and lantype='1' order by year desc
 * 두 번의 N+1 조회를 한 번에 읽어 연도별로 묶는 방식으로 바꿨다.
 */
import { isDbConfigured, query, SQL } from '@/lib/db';

export type HistoryEntry = {
  month: string;
  content: string;
};

export type HistoryYear = {
  year: string;
  entries: HistoryEntry[];
};

/**
 * 연혁 조회 (연도 내림차순 → 월 내림차순)
 *
 * DB 미연결이거나 조회에 실패하면 빈 배열을 돌려준다. 화면은 안내 문구를 그린다.
 */
export async function selectHistoryList(): Promise<HistoryYear[]> {
  if (!isDbConfigured()) {
    console.warn('[company] DB 미연결 모드 - 연혁 조회를 건너뜁니다.');
    return [];
  }

  try {
    const rows = await query<{ HIST_YR: string; HIST_MM: string; HIST_CTT: string }>(SQL`
      SELECT HIST_YR, HIST_MM, HIST_CTT
        FROM TBL_HP_HISTORY
       WHERE USE_YN = 'Y'
       ORDER BY HIST_YR DESC, HIST_MM DESC, MENU_SEQO
    `);

    const grouped: HistoryYear[] = [];

    for (const row of rows) {
      const last = grouped[grouped.length - 1];

      if (last?.year === row.HIST_YR) {
        last.entries.push({ month: row.HIST_MM, content: row.HIST_CTT });
      } else {
        grouped.push({
          year: row.HIST_YR,
          entries: [{ month: row.HIST_MM, content: row.HIST_CTT }],
        });
      }
    }

    return grouped;
  } catch (error) {
    console.error('Failed to fetch selectHistoryList :', error);
    return [];
  }
}
