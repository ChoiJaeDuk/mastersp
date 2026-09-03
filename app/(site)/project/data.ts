/**
 * 수행과제 데이터 조회
 *
 * 레거시: kor/project/project.html
 *   select * from tb_category where tablename='tb_project' ... order by catename desc
 *   select ... from tb_project where mode='1'|'2' and depth1='{cateno}' ...
 * 카테고리마다 쿼리를 반복하던 것을 한 번의 조인으로 바꿨다.
 */
import { isDbConfigured, query, SQL } from '@/lib/db';

import type { ProjectsByKind } from './types';

export * from './types';

type ProjectRow = {
  PRJ_SQNO: number;
  PRJ_KND_CD: string;
  PRJ_NM: string;
  PRJ_CTT: string | null;
  BGNG_DE: string | null;
  END_DE: string | null;
  ORDR_NM: string | null;
  CTG_NM: string | null;
};

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
      SELECT P.PRJ_SQNO,
             P.PRJ_KND_CD,
             P.PRJ_NM,
             P.PRJ_CTT,
             P.BGNG_DE,
             P.END_DE,
             P.ORDR_NM,
             C.CTG_NM
        FROM TBL_HP_PROJECT P
        LEFT JOIN TBL_HP_PROJECT_CTG C ON P.CTG_SQNO = C.CTG_SQNO
       WHERE P.USE_YN = 'Y'
       ORDER BY (C.CTG_NM IS NULL), C.CTG_NM DESC, P.MENU_SEQO, P.PRJ_SQNO
    `);

    const grouped: ProjectsByKind = {};

    for (const row of rows) {
      const categories = (grouped[row.PRJ_KND_CD] ??= []);
      const name = row.CTG_NM ?? '기타';

      let category = categories.find((entry) => entry.name === name);

      if (!category) {
        category = { name, items: [] };
        categories.push(category);
      }

      category.items.push({
        id: row.PRJ_SQNO,
        title: row.PRJ_NM,
        contents: (row.PRJ_CTT ?? '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        startDate: row.BGNG_DE,
        endDate: row.END_DE,
        client: row.ORDR_NM,
      });
    }

    return grouped;
  } catch (error) {
    console.error('Failed to fetch selectProjectList :', error);
    return {};
  }
}
