'use client';

import { useState } from 'react';

import { formatDate } from '@/common/util';
import { PROJECT_KINDS, type ProjectsByKind } from '../types';

/**
 * 수행과제 탭 + 아코디언 (Client Component)
 * 원본: kor/project/project.html 의 .tab-head / .accordion-item
 */
export default function ProjectTabs({ projects }: { projects: ProjectsByKind }) {
  const [activeKind, setActiveKind] = useState<string>(PROJECT_KINDS[0].code);
  /** 열려 있는 아코디언 항목 id */
  const [openId, setOpenId] = useState<number | null>(null);

  const categories = projects[activeKind] ?? [];

  return (
    <div>
      {/* 탭 */}
      <div role="tablist" aria-label="수행과제 구분" className="flex border-b border-[#ddd]">
        {PROJECT_KINDS.map((kind) => (
          <button
            key={kind.code}
            type="button"
            role="tab"
            aria-selected={activeKind === kind.code}
            onClick={() => {
              setActiveKind(kind.code);
              setOpenId(null);
            }}
            className="-mb-px border-b-2 px-5 py-4 text-[1rem] transition-colors
                       aria-selected:border-brand aria-selected:font-semibold aria-selected:text-brand
                       aria-[selected=false]:border-transparent aria-[selected=false]:text-shell
                       hover:text-brand"
          >
            {kind.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div role="tabpanel" className="mt-10 lg:mt-14">
        {categories.length === 0 ? (
          <p className="t-dec-03 text-shell">등록된 수행과제가 없습니다.</p>
        ) : (
          <div className="space-y-12 lg:space-y-16">
            {categories.map((category) => (
              <section key={category.name}>
                <p className="t-title-md font-display font-black text-brand">{category.name}</p>

                <ul className="mt-5 border-t-2 border-ink">
                  {category.items.map((item) => {
                    const isOpen = openId === item.id;

                    return (
                      <li key={item.id} className="border-b border-[#eee]">
                        <h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`project-panel-${item.id}`}
                            onClick={() => setOpenId(isOpen ? null : item.id)}
                            className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left"
                          >
                            <span className="t-dec-01 font-semibold text-ink">{item.title}</span>
                            <span
                              aria-hidden
                              className={`shrink-0 text-brand transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            >
                              ▾
                            </span>
                          </button>
                        </h3>

                        <div
                          id={`project-panel-${item.id}`}
                          hidden={!isOpen}
                          className="bg-[#fafafa] px-5 py-6"
                        >
                          <dl className="space-y-4">
                            <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                              <dt className="w-20 shrink-0 text-[0.9375rem] font-semibold text-ink">
                                기간
                              </dt>
                              <dd className="t-dec-03 text-shell">
                                {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                              </dd>
                            </div>

                            {item.client ? (
                              <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                                <dt className="w-20 shrink-0 text-[0.9375rem] font-semibold text-ink">
                                  발주처
                                </dt>
                                <dd className="t-dec-03 text-shell">{item.client}</dd>
                              </div>
                            ) : null}

                            {item.contents.length > 0 ? (
                              <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                                <dt className="w-20 shrink-0 text-[0.9375rem] font-semibold text-ink">
                                  내용
                                </dt>
                                <dd>
                                  <ul className="space-y-2">
                                    {item.contents.map((line, index) => (
                                      <li key={index} className="relative pl-4">
                                        <span
                                          aria-hidden
                                          className="absolute top-[0.7em] left-0 size-1.5 rounded-full bg-brand"
                                        />
                                        <span className="t-dec-03 text-shell">{line}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </dd>
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
