/**
 * GNB / 푸터 공용 네비게이션 데이터
 * 원본: https://www.masterspace.co.kr/kor/main/main.html
 */

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** 메가 드롭다운 이미지 (권장 사이즈 422*232) */
  image: string;
  /** 메가 드롭다운 설명 문구 (줄 단위) */
  description: string[];
  children: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'drop-1',
    label: '회사소개',
    href: '/company',
    image: '/images/main/gnb-img01.jpg',
    description: ['장인의공간은', '국내 최고의 R&D 전문 기업을', '목표로 합니다.'],
    children: [
      { label: '인사말', href: '/company#greeting' },
      { label: '연혁', href: '/company#history' },
      { label: '조직도', href: '/company#chart' },
      { label: '오시는 길', href: '/company#come' },
    ],
  },
  {
    id: 'drop-2',
    label: '제품소개',
    href: '/product/m-core',
    image: '/images/main/gnb-img02.jpg',
    description: ['시장 변화에도', '유연하게 대응이', '가능합니다.'],
    children: [
      { label: 'M-CORE', href: '/product/m-core' },
      { label: 'M-CORES', href: '/product/m-cores' },
      { label: '전력거래시스템 (ETS)', href: '/product/ets' },
      { label: 'EMAT', href: '/product/emat' },
      { label: '마이크로그리드 최적화시뮬레이터', href: '/product/micro' },
      { label: 'MSYS', href: '/product/msys' },
      { label: 'TEPS', href: '/product/teps' },
    ],
  },
  {
    id: 'drop-3',
    label: '수행과제',
    href: '/project',
    image: '/images/main/gnb-img03.jpg',
    description: ['다양한 요구사항에 맞는', '최적의 시스템을', '구축합니다.'],
    children: [{ label: '수행과제', href: '/project' }],
  },
  {
    id: 'drop-4',
    label: '전력IT',
    href: '/strategy',
    image: '/images/main/gnb-img04.jpg',
    description: ['전력시장의', '미래를 이끌어갑니다.'],
    children: [
      { label: '전력시장', href: '/strategy#type--01' },
      { label: '수요반응', href: '/strategy#type--02' },
      { label: 'HEMS / BEMS', href: '/strategy#type--03' },
      { label: 'Microgrid', href: '/strategy#type--04' },
      { label: 'Smart Grid', href: '/strategy#type--05' },
    ],
  },
  {
    id: 'drop-5',
    label: '고객문의',
    href: '/inquiry',
    image: '/images/main/gnb-img05.jpg',
    description: ['에너지에 대한', '궁금한 사항을', '해결해 드립니다.'],
    children: [{ label: '고객문의', href: '/inquiry' }],
  },
];

export const POLICY_LINKS: NavChild[] = [
  { label: '개인정보처리방침', href: '/policy/privacy' },
  { label: '이메일무단수집거부', href: '/policy/email-security' },
];

export const COMPANY_INFO = {
  name: '(주)장인의공간',
  ceo: '정해성',
  bizNo: '206-86-39785',
  email: 'master@masterspace.co.kr',
  engSiteUrl: 'https://www.masterspace.co.kr/eng/main/main.html',
  copyright: 'Copyright © 2024 장인의공간. All Rights Reserved.',
};
