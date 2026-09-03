/**
 * 제품소개 페이지 (Server Component)
 * 원본: kor/product/{slug}.html
 *
 * 원본 마크업(.sc--product .pd-content > .type--01 / .type--02 / .type--03)을 그대로 사용한다.
 * 본문 데이터는 lib/content/products.ts (원본 HTML 변환 결과)에서 읽는다.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ContentBlocks from '@/components/content/ContentBlocks';
import FixNav from '@/components/layout/FixNav';
import SubVisual, { type SubVisualSize } from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { getProduct, PRODUCTS } from '@/lib/content/products';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-2')!;

/**
 * 서브 비주얼 크기 (원본이 제품마다 sub-visual02 / 03 / 04 를 나눠 쓴다)
 *   ets   -> sub-visual03 (.small-title)
 *   micro -> sub-visual04 (.small-title2)
 */
const VISUAL_SIZE: Record<string, SubVisualSize> = {
  ets: 'small',
  micro: 'small2',
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return {};

  return {
    title: `${product.name} | ${NAV.label} | ${COMPANY_INFO.name}`,
    description:
      product.intro[0]?.type === 'p' ? product.intro[0].text.replace(/\n/g, ' ') : undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  return (
    <>
      <SubVisual titleEn={product.name} size={VISUAL_SIZE[product.slug] ?? 'default'} />
      <FixNav items={NAV.children} variant="pd-nav en-pd-nav" />

      <main className="main" id="contents">
        <section className="sc--product">
          {/* 상단 배경 (원본 .m-core-bg 등) */}
          <Reveal>
            <div className={product.heroClass} />
          </Reveal>

          <div className="pd-content">
            <div className="sub-container">
              {/* 제품소개 */}
              <div className="type--01">
                <Reveal className="sub-title-bx">
                  <p className="title">{product.name}</p>
                  <p className="info--title">제품소개</p>
                </Reveal>

                <Reveal className="text-bx">
                  <ContentBlocks blocks={product.intro} />
                </Reveal>
              </div>

              {/* 제품 구성도 — m-core 는 이미지, 나머지는 CSS 배경 */}
              {product.dbImages ? (
                <Reveal className="db-img">
                  {/* 원본이 width:100% 이미지라 next/image 대신 그대로 둔다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.dbImages[0]} className="hidden lg:block" alt="db-img" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.dbImages[1]} className="block lg:hidden" alt="db-img" />
                </Reveal>
              ) : product.dbImgClass ? (
                <Reveal>
                  <div className={product.dbImgClass} />
                </Reveal>
              ) : null}

              {product.contentImg ? (
                <Reveal>
                  <div className="content-img" />
                </Reveal>
              ) : null}

              {/* 제품특징 */}
              <div className="type--02">
                <Reveal className="sub-title-bx">
                  <p className="title">{product.name}</p>
                  <p className="info--title">제품특징</p>
                </Reveal>

                <div className="information-list">
                  {product.features.map((group, index) => (
                    <Reveal key={index} className="information-item">
                      {group.title ? (
                        <p className="dec--03 font-weight-medium">{group.title}</p>
                      ) : null}
                      <ContentBlocks blocks={group.blocks} />
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* SUDP 이미지 (m-core 만) */}
              {product.sudpImages ? (
                <Reveal className="sudp-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.sudpImages[0]} className="hidden lg:block" alt="sudp-img" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.sudpImages[1]} className="block lg:hidden" alt="sudp-img" />
                </Reveal>
              ) : null}

              {/* 구축사례 */}
              {product.cases.length > 0 ? (
                <div className="type--03">
                  <Reveal className="sub-title-bx">
                    <p className="title">{product.name}</p>
                    <p className="info--title">구축사례</p>
                  </Reveal>

                  <div className={product.caseListClass}>
                    <ul className="case-item">
                      {product.cases.map((item, index) => (
                        <li key={index}>
                          <p className={product.dateClass}>{item.date}</p>
                          <p className="dec">{item.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
