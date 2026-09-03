'use client';

import { useState } from 'react';

import { getTermContent } from '@/app/(site)/policy/actions';
import type { TermSlug } from '@/app/(site)/policy/data';
import Popup from '@/components/ui/Popup';

/** 팝업 제목 (원본 arr_data.php 의 $nav_policy_N) */
const TITLES: Record<TermSlug, string> = {
  privacy: '개인정보처리방침',
  term: '이용약관',
  'email-security': '이메일무단수집거부',
};

/**
 * 약관 팝업 링크 (원본 .popup-link)
 * 원본: 푸터의 개인정보처리방침 / 이메일무단수집거부, 고객문의의 [전문보기]
 *
 * 원본은 magnific-popup 이 kor/pop/*.html 을 ajax 로 불러 띄운다.
 * 여기서는 클릭 시 서버 액션으로 본문(TBL_HP_TERM)을 읽어 같은 마크업의 팝업에 넣는다.
 */
export default function PolicyPopupLink({
  kind,
  children,
  className = 'link popup-link',
}: {
  kind: TermSlug;
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async () => {
    setIsOpen(true);

    // 한 번 읽어온 본문은 다시 읽지 않는다.
    if (content !== null) return;

    setLoading(true);
    try {
      setContent(await getTermContent(kind));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className={className} onClick={open}>
        {children}
      </button>

      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} title={TITLES[kind]}>
        {loading ? (
          <p className="dec--04">불러오는 중…</p>
        ) : content ? (
          // 본문은 관리자가 등록한 HTML 이다.
          <div
            className="dec--04 text-keep text-gray-5 font-weight-light"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="dec--04">등록된 내용이 없습니다.</p>
        )}
      </Popup>
    </>
  );
}
