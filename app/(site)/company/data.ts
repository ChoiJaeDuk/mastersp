/**
 * 회사소개 데이터 조회
 *
 * 레거시 운영 DB(masterspace_co_kr)의 tb_history 를 직접 읽는다.
 *
 * 원본 쿼리: kor/company/company.html
 *   select year from tb_history where lantype='1' and viewtype='Y' group by year order by year desc
 *   select month,content from tb_history where year='...' and lantype='1' order by year desc
 * 연도마다 쿼리를 반복하던 것을 한 번에 읽어 연도별로 묶는 방식으로 바꿨다.
 *
 * 실제 컬럼 구조 (scripts/check-legacy.mjs 로 확인)
 *   year char(4) NOT NULL / month char(2) NULL / content text NOT NULL
 *   viewtype enum('Y','N') / lantype varchar(10) ('1'=국문, '2'=영문)
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
    const rows = await query<{ year: string; month: string | null; content: string }>(SQL`
      SELECT year, month, content
        FROM tb_history
       WHERE lantype = '1'
         AND viewtype = 'Y'
       ORDER BY year DESC, month DESC, sortnum
    `);

    const grouped: HistoryYear[] = [];

    for (const row of rows) {
      const last = grouped[grouped.length - 1];
      const entry = { month: row.month ?? '', content: row.content };

      if (last?.year === row.year) last.entries.push(entry);
      else grouped.push({ year: row.year, entries: [entry] });
    }

    return grouped;
  } catch (error) {
    console.error('Failed to fetch selectHistoryList :', error);
    return [];
  }
}
