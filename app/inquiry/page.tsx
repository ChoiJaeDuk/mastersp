/**
 * 고객문의 페이지 (Server Component)
 * 원본: kor/inquiry/inquiry.html
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

export default function InquiryPage() {
  return (
    <main id="contents" className="overflow-x-clip">
      <SubVisual titleEn={NAV.labelEn} titleKo={NAV.label} />

      <section className="py-20 lg:py-30">
        <div className="site-container">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
            {/* 좌측: 사업장 정보 (원본 .left-bx) */}
            <div>
              <ul className="space-y-10">
                <li>
                  <Reveal>
                    <p className="t-dec-03 font-display font-bold text-brand">Office</p>
                    <div className="mt-4 space-y-4">
                      {OFFICES.map((office) => (
                        <p key={office.name} className="t-dec-01 font-semibold">
                          <span className="block text-[0.875rem] font-normal text-shell">
                            {office.name}
                          </span>
                          {office.address}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </li>

                <li>
                  <Reveal>
                    <p className="t-dec-03 font-display font-bold text-brand">Tel</p>
                    <div className="mt-4 space-y-4">
                      {OFFICES.filter((office) => office.tel).map((office) => (
                        <p key={office.name} className="t-dec-01 font-semibold">
                          <span className="block text-[0.875rem] font-normal text-shell">
                            {office.name}
                          </span>
                          <a href={`tel:${office.tel.split('~')[0]}`} className="hover:text-brand">
                            {office.tel}
                          </a>
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </li>

                <li>
                  <Reveal>
                    <p className="t-dec-03 font-display font-bold text-brand">Fax</p>
                    <div className="mt-4 space-y-4">
                      {OFFICES.filter((office) => office.fax).map((office) => (
                        <p key={office.name} className="t-dec-01 font-semibold">
                          <span className="block text-[0.875rem] font-normal text-shell">
                            {office.name}
                          </span>
                          {office.fax}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </li>

                <li>
                  <Reveal>
                    <p className="t-dec-03 font-display font-bold text-brand">E-mail</p>
                    <p className="t-dec-01 mt-4 font-semibold">
                      <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-brand">
                        {COMPANY_INFO.email}
                      </a>
                    </p>
                  </Reveal>
                </li>
              </ul>
            </div>

            {/* 우측: 문의 폼 (원본 .right-bx) */}
            <div>
              <Reveal>
                <h2 className="t-info-title font-display font-black">Contact Us</h2>
                <p className="t-dec-01 mt-5 text-shell lg:mt-7">
                  장인의공간은 고객의 의견을 소중히 생각합니다.
                  <br />
                  궁금한 사항이나 제안하고 싶은 내용이 있으시면 언제든지 문의해 주세요.
                </p>
              </Reveal>

              <div className="mt-10 lg:mt-13">
                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
