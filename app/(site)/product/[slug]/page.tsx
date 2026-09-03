/**
 * 제품소개 페이지 (Server Component)
 * 원본: kor/product/{slug}.html
 *
 * 본문은 lib/content/products.ts (레거시 HTML 변환 결과)에서 읽는다.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import ContentBlocks from '@/components/content/ContentBlocks';
import SectionTitle from '@/components/layout/SectionTitle';
import SubNav from '@/components/layout/SubNav';
import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { getProduct, PRODUCTS } from '@/lib/content/products';
import { COMPANY_INFO, NAV_ITEMS } from '@/lib/navigation';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-2')!;

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
    title: `${product.name} | ${COMPANY_INFO.name}`,
    description: product.intro[0]?.type === 'p' ? product.intro[0].text.replace(/\n/g, ' ') : undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  return (
    <main id="contents" className="overflow-x-clip">
      <SubVisual titleEn={NAV.labelEn} titleKo={NAV.label} />
      <SubNav items={NAV.children} />

      {/* 상단 배경 이미지 (원본 .xxx-bg) */}
      {product.heroImage ? (
        <Reveal>
          <div
            role="img"
            aria-label={`${product.name} 대표 이미지`}
            className="h-50 bg-cover bg-center bg-no-repeat lg:h-[25rem]"
            // 제품마다 다른 이미지라 인라인 스타일로 지정한다.
            style={{ backgroundImage: `url('${product.heroImage}')` }}
          />
        </Reveal>
      ) : null}

      <div className="site-container py-20 lg:py-30">
        {/* 제품소개 */}
        <section>
          <SectionTitle label={product.name} title="제품소개" />
          <ContentBlocks blocks={product.intro} className="mt-8 lg:mt-12" />
        </section>

        {/* 제품 구성도 */}
        {product.dbImage ? (
          <Reveal className="mt-14 lg:mt-20">
            <Image
              src={product.dbImage}
              alt={`${product.name} 구성도`}
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="h-auto w-full"
            />
          </Reveal>
        ) : null}

        {/* 제품특징 */}
        {product.features.length > 0 ? (
          <section className="mt-20 lg:mt-30">
            <SectionTitle label={product.name} title="제품특징" />
            <div className="mt-8 space-y-12 lg:mt-12 lg:space-y-16">
              {product.features.map((group, index) => (
                <Reveal key={index}>
                  {group.title ? (
                    <p className="t-dec-01 font-semibold text-ink">{group.title}</p>
                  ) : null}
                  <ContentBlocks blocks={group.blocks} className={group.title ? 'mt-4' : ''} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {/* 구축사례 */}
        {product.cases.length > 0 ? (
          <section className="mt-20 lg:mt-30">
            <SectionTitle label={product.name} title="구축사례" />
            <Reveal className="mt-8 lg:mt-12">
              <ul className="border-t-2 border-ink">
                {product.cases.map((item, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-1 border-b border-[#eee] py-4 sm:flex-row sm:gap-8"
                  >
                    <span className="w-full shrink-0 text-[0.9375rem] font-semibold text-brand sm:w-48">
                      {item.date}
                    </span>
                    <span className="t-dec-03 whitespace-pre-line text-shell">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        ) : null}
      </div>
    </main>
  );
}
