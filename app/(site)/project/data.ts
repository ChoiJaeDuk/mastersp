/**
 * 수행과제 데이터 조회
 *
 * 레거시 운영 DB(masterspace_co_kr)의 tb_project / tb_category 를 직접 읽는다.
 * 기존 PHP 관리자에서 등록한 데이터를 그대로 쓰기 위한 것이다.
 *
 * 원본 쿼리: kor/project/project.html
 *   select * from tb_category where tablename='tb_project' and lantype='1' order by catename desc
 *   select ... from tb_project where mode='1'|'2' and lantype='1' and viewtype='Y' and depth1='{cateno}'
 * 분류마다 쿼리를 반복하던 것을 한 번의 조인으로 바꿨다. (분류 15개 × 2탭 = 30회 → 1회)
 *
 * 실제 컬럼 구조는 scripts/check-legacy.mjs 로 확인했다.
 *   tb_project.mode         varchar(50)  '1'=개발 / '2'=연구
 *   tb_project.depth1       int(8)       → tb_category.cateno
 *   tb_project.field_etc_01 varchar(255) 발주처
 *   tb_project.sdate/edate  varchar(20)  'YYYY-MM-DD' 문자열
 */
import { isDbConfigured, query, SQL } from '@/lib/db';

import type { ProjectCategory, ProjectsByKind } from './types';

export * from './types';

type ProjectRow = {
  uid: number;
  mode: string;
  title: string;
  content: string | null;
  sdate: string | null;
  edate: string | null;
  field_etc_01: string | null;
  catename: string | null;
};

/** 레거시가 저장한 날짜 문자열에서 'YYYY-MM-DD' 만 취한다. */
function toDate(value: string | null): string | null {
  const text = String(value ?? '').slice(0, 10);

  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

/**
 * 수행과제 조회
 *
 * DB 미연결이거나 조회에 실패하면 빈 객체를 돌려준다.
 */
export async function selectProjectList(): Promise<ProjectsByKind> {
  if (!isDbConfigured()) {
    console.warn('[project] DB 미연결 모드 - 수행과제 조회를 건너뜁니다.');
    return {};
  }

  try {
    const rows = await query<ProjectRow>(SQL`
      SELECT P.uid,
             P.mode,
             P.title,
             P.content,
             P.sdate,
             P.edate,
             P.field_etc_01,
             C.catename
        FROM tb_project P
        LEFT JOIN tb_category C
               ON C.cateno = P.depth1
              AND C.tablename = 'tb_project'
              AND C.lantype = '1'
       WHERE P.lantype = '1'
         AND P.viewtype = 'Y'
       ORDER BY P.mode, (C.catename IS NULL), C.catename DESC, P.sortnum, P.uid
    `);

    const grouped: ProjectsByKind = {};

    for (const row of rows) {
      // 레거시 mode 는 varchar 라 '1' / '2' 외의 값이 들어올 수 있어 방어한다.
      const kind = row.mode === '2' ? '2' : '1';
      const categories = (grouped[kind] ??= []);
      const name = row.catename ?? '기타';

      let category: ProjectCategory | undefined = categories.find((entry) => entry.name === name);

      if (!category) {
        category = { name, items: [] };
        categories.push(category);
      }

      category.items.push({
        id: row.uid,
        title: row.title,
        // 레거시는 CRLF 로 저장돼 있고, 화면에서는 줄 단위로 불릿이 된다.
        contents: (row.content ?? '')
          .split(/\r\n?|\n/)
          .map((line) => line.trim())
          .filter(Boolean),
        startDate: toDate(row.sdate),
        endDate: toDate(row.edate),
        client: row.field_etc_01 || null,
      });
    }

    return grouped;
  } catch (error) {
    console.error('Failed to fetch selectProjectList :', error);
    return {};
  }
}
