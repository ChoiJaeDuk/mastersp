/**
 * 수행과제 타입 / 상수
 *
 * 클라이언트 컴포넌트에서도 쓰므로 DB 모듈(pg)을 끌어오지 않도록 data.ts 와 분리한다.
 */

/** 과제구분 (레거시 tb_project.mode) */
export const PROJECT_KINDS = [
  { code: '1', label: '개발 프로젝트내역' },
  { code: '2', label: '연구 프로젝트내역' },
] as const;

export type ProjectItem = {
  id: number;
  title: string;
  /** 줄바꿈 단위로 나눈 내용 (원본 explode("\n", content)) */
  contents: string[];
  startDate: string | null;
  endDate: string | null;
  client: string | null;
};

export type ProjectCategory = {
  /** 분류명 (연도 등). 미지정이면 '기타' */
  name: string;
  items: ProjectItem[];
};

/** 과제구분 코드 → 분류 목록 */
export type ProjectsByKind = Record<string, ProjectCategory[]>;
