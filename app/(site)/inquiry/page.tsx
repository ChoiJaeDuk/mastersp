/**
 * 고객문의 페이지 (Server Component)
 * 원본: kor/inquiry/inquiry.html
 *
 * 원본 마크업(.sc--inquiry .form-wrap > .left-bx / .right-bx)을 그대로 사용한다.
 */
import type { Metadata } from 'next';

import SubVisual from '@/components/layout/SubVisual';
import Reveal from '@/components/ui/Reveal';
import { COMPANY_INFO, NAV_ITEMS, OFFICES } from '@/lib/navigation';

import InquiryForm from './components/InquiryForm';

const NAV = NAV_ITEMS.find((item) => item.id === 'drop-5')!;

export const metadata: Metadata = {
  title: `${NAV.label} | ${COMPANY_INFO.name}`,
  description: '(주)장인의공간에 궁금한 사항이나 제안하고 싶은 내용을 문의해 주세요.',
};

/** 좌측 사업장 정보 (원본 .form-info) */
const INFO_GROUPS = [
  {
    label: 'Office',
    rows: OFFICES.map((office) => ({ name: office.name, value: office.address })),
  },
  {
    label: 'Tel',
    rows: OFFICES.filter((office) => office.tel).map((office) => ({
      name: office.name,
      value: office.tel,
    })),
  },
  {
    label: 'Fax',
    rows: OFFICES.filter((office) => office.fax).map((office) => ({
      name: office.name,
      value: office.fax,
    })),
  },
  {
    label: 'E-mail',
    rows: [{ name: '', value: COMPANY_INFO.email }],
  },
];

export default function InquiryPage() {
  return (
    <>
      <SubVisual titleEn={NAV.labelEn} />

      <main className="main" id="contents">
        <section className="sc--inquiry">
          <div className="sub-container">
            <div className="form-wrap">
              <div className="left-bx">
                <ul className="form-info">
                  {INFO_GROUPS.map((group) => (
                    <Reveal key={group.label} as="li">
                      <p className="dec--03">{group.label}</p>
                      {group.rows.map((row, index) => (
                        <p
                          key={index}
                          className={`dec--01 sm-bold ${index === 0 ? 'mt-5 lg:mt-0' : 'mt-3 lg:mt-5'}`}
                        >
                          {row.name ? (
                            <span className="addr-tit addr-tit2 block">{row.name}</span>
                          ) : null}
                          {row.value}
                        </p>
                      ))}
                    </Reveal>
                  ))}
                </ul>
              </div>

              <div className="right-bx">
                <div className="input-form">
                  <Reveal className="form-head">
                    <h4 className="info--title">Contact Us</h4>
                    <p className="dec--04 mt-5 lg:mt-7">
                      장인의공간은 고객의 의견을 소중히 생각합니다.
                      <br />
                      궁금한 사항이나 제안하고 싶은 내용이 있으시면 언제든지 문의해 주세요.
                    </p>
                  </Reveal>

                  <InquiryForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
