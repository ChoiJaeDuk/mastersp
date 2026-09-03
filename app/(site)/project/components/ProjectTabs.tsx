'use client';

import { useState } from 'react';

import { formatDate } from '@/common/util';
import { PROJECT_KINDS, type ProjectsByKind } from '../types';

/**
 * 수행과제 탭 + 아코디언 (Client Component)
 * 원본: kor/project/project.html 의 .tab-head / .tab-body / .accordion-item
 *
 * 원본은 tab-1.1.0.masstige.js + jQuery slideToggle 로 동작하는데,
 * 같은 클래스(.on / .active)를 React state 로 토글해 동일하게 재현했다.
 */
export default function ProjectTabs({
  projects,
  /** 탭별 좌측 고정 문구 (원본 .fix-title-bx) */
  intros,
}: {
  projects: ProjectsByKind;
  intros: { title: string; desc: string }[];
}) {
  const [activeTab, setActiveTab] = useState(0);

  /** 열려 있는 아코디언 (탭별로 따로 관리) */
  const [openIds, setOpenIds] = useState<Record<number, number | null>>({});

  const toggle = (tabIndex: number, id: number) =>
    setOpenIds((prev) => ({ ...prev, [tabIndex]: prev[tabIndex] === id ? null : id }));

  return (
    <div className="project-wrap">
      <div className="tab-head">
        <ul className="tab-head-list">
          {PROJECT_KINDS.map((kind, index) => (
            <li key={kind.code} className={activeTab === index ? 'on' : ''}>
              <button type="button" onClick={() => setActiveTab(index)}>
                {kind.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="tab-body">
        {PROJECT_KINDS.map((kind, tabIndex) => {
          const categories = projects[kind.code] ?? [];
          // 첫 항목은 원본과 같이 기본으로 펼쳐 둔다.
          const defaultOpenId = categories[0]?.items[0]?.id ?? null;
          const openId =
            openIds[tabIndex] === undefined ? defaultOpenId : openIds[tabIndex];

          return (
            <div key={kind.code} className={`tab-con${activeTab === tabIndex ? ' on' : ''}`}>
              <div className="left-bx">
                <div className="fix-title-bx">
                  <p className="fix-title">
                    {intros[tabIndex].title.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index === 0 ? <br className="hidden lg:block" /> : null}
                      </span>
                    ))}
                  </p>
                  <p className="dec--01 font-weight-medium whitespace-pre-line">
                    {intros[tabIndex].desc}
                  </p>
                </div>
              </div>

              <div className="right-bx">
                {categories.length === 0 ? (
                  <p className="dec--03">등록된 수행과제가 없습니다.</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.name} className="flex-bx">
                      <p className="year title--md sm-bold active">{category.name}</p>

                      {category.items.map((item) => {
                        const isOpen = openId === item.id;

                        return (
                          <div
                            key={item.id}
                            className={`accordion-item${isOpen ? ' active' : ''}`}
                          >
                            <div className="flex-title">
                              <div
                                className="heading"
                                role="button"
                                tabIndex={0}
                                aria-expanded={isOpen}
                                onClick={() => toggle(tabIndex, item.id)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    toggle(tabIndex, item.id);
                                  }
                                }}
                              >
                                <p className="dec--01 sm-bold">{item.title}</p>
                                <i className="xi-angle-down" aria-hidden />
                              </div>

                              <ul className={`flex-item${isOpen ? ' active' : ''}`}>
                                <li className="flex-con">
                                  <p className="con-tit sm-bold">
                                    <span>기간</span>
                                  </p>
                                  <p className="con-dec">
                                    {formatDate(item.startDate)}~{formatDate(item.endDate)}
                                  </p>
                                </li>
                                <li className="flex-con">
                                  <p className="con-tit sm-bold">
                                    <span>발주처</span>
                                  </p>
                                  <p className="con-dec">{item.client ?? ''}</p>
                                </li>
                                <li className="flex-con">
                                  <p className="con-tit sm-bold">
                                    <span>내용</span>
                                  </p>
                                  <ul className="bullet-list bullet-list--disc">
                                    {item.contents.map((line, index) => (
                                      <li key={index} className="item">
                                        <p className="dec--04">{line}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
