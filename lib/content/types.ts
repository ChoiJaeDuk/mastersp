/**
 * 정적 콘텐츠 블록 타입
 *
 * 레거시 HTML 의 문단 / 불릿 / 표를 그대로 옮기기 위한 최소 구조다.
 * scripts/convert-legacy-product.py 가 이 형태로 데이터를 만든다.
 */

/** 문단. text 안의 줄바꿈(\n)은 원본의 <br> 이다. */
export type ParagraphBlock = { type: 'p'; text: string };

/** 불릿 목록 (원본 .bullet-bx) */
export type ListBlock = { type: 'list'; items: string[] };

/** 표 (원본 .table-list) */
export type TableBlock = { type: 'table'; head: string[]; rows: string[][] };

export type ContentBlock = ParagraphBlock | ListBlock | TableBlock;

/** 제품특징의 한 항목 (원본 .information-item) */
export type FeatureGroup = {
  /** 예: '1. 엔진의 특성' */
  title: string;
  blocks: ContentBlock[];
};

/** 구축사례 한 줄 (원본 .case-item li) */
export type ProductCase = {
  date: string;
  desc: string;
};

export type ProductContent = {
  slug: string;
  name: string;
  /** 상단 배경 이미지 */
  heroImage: string | null;
  /** 제품 구성도 이미지 */
  dbImage: string | null;
  intro: ContentBlock[];
  features: FeatureGroup[];
  cases: ProductCase[];
};
