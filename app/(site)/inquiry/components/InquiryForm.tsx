'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { formatPhone } from '@/common/util';
import PolicyPopupLink from '@/components/ui/PolicyPopupLink';
import { createInquiry } from '../actions';
import { initialInquiryFormState } from '../types';

/**
 * 고객문의 등록 폼 (Client Component)
 * 원본: kor/inquiry/inquiry.html 의 #signform
 *
 * 원본 마크업(.form-body > ul > li / .tit / .input_for / .chk-bx / .inquiry-btn-bx)을 그대로 쓴다.
 * 원본은 jQuery ajax + alert 로 처리하지만, 여기서는 Server Action 과
 * 화면 내 메시지(aria-live)로 대체했다.
 */
const FIELDS = [
  { name: 'inqFldNm', label: '문의분야', type: 'text', placeholder: '문의분야를 입력해주세요.' },
  { name: 'coNm', label: '회사명', type: 'text', placeholder: '회사명을 입력해주세요.' },
  { name: 'pstnNm', label: '직함', type: 'text', placeholder: '직함을 입력해주세요.' },
  { name: 'wrtrNm', label: '이름', type: 'text', placeholder: '이름을 입력해주세요.' },
  {
    name: 'wrtrTelno',
    label: '연락처',
    type: 'tel',
    placeholder: '“―” 없이 입력해주세요. (예 : 01012345678)',
  },
  {
    name: 'wrtrEml',
    label: '이메일',
    type: 'email',
    placeholder: '이메일을 입력해주세요. (예 : sample@sample.com)',
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="inquiry-btn" disabled={pending}>
      {pending ? '접수 중...' : '문의하기'}
    </button>
  );
}

export default function InquiryForm() {
  const [state, formAction] = useActionState(createInquiry, initialInquiryFormState);
  const [phone, setPhone] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
      setPhone('');
    }

    if (state.status !== 'idle') alertRef.current?.focus();
  }, [state]);

  return (
    <form ref={formRef} id="signform" name="signform" action={formAction} noValidate>
      <div className="form-body">
        <ul>
          {FIELDS.map((field) => (
            <li key={field.name}>
              <div className="tit">
                <strong>
                  <label htmlFor={field.name}>{field.label}</label>
                  <span>*</span>
                </strong>
              </div>
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className="input_for"
                required
                aria-invalid={Boolean(state.fieldErrors[field.name])}
                aria-describedby={state.fieldErrors[field.name] ? `${field.name}-error` : undefined}
                {...(field.name === 'wrtrTelno'
                  ? {
                      value: phone,
                      onChange: (event) => setPhone(formatPhone(event.target.value)),
                      inputMode: 'numeric' as const,
                    }
                  : {})}
              />
              {state.fieldErrors[field.name] ? (
                <p id={`${field.name}-error`} className="dec--04 mt-2 text-[#fe6b00]">
                  {state.fieldErrors[field.name]}
                </p>
              ) : null}
            </li>
          ))}

          <li>
            <div className="tit">
              <strong>
                <label htmlFor="inqCtt">문의내용</label>
                <span>*</span>
              </strong>
            </div>
            <textarea
              id="inqCtt"
              name="inqCtt"
              rows={6}
              placeholder="문의하실 내용을 입력해주세요."
              className="input_for mt-3"
              required
              aria-invalid={Boolean(state.fieldErrors.inqCtt)}
              aria-describedby={state.fieldErrors.inqCtt ? 'inqCtt-error' : undefined}
            />
            {state.fieldErrors.inqCtt ? (
              <p id="inqCtt-error" className="dec--04 mt-2 text-[#fe6b00]">
                {state.fieldErrors.inqCtt}
              </p>
            ) : null}
          </li>

          {/* 원본의 체크박스는 input 뒤의 label 에 :before/:after 로 그린다. */}
          <li className="chk-bx">
            <input type="checkbox" id="yark" name="privacyAgreed" value="Y" title="개인정보 수집 및 이용" />
            <label htmlFor="yark" className="term-chk">
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </label>
            {/* 원본도 개인정보처리방침 팝업을 띄운다. */}
            <PolicyPopupLink kind="privacy" className="popup-link">
              [전문보기]
            </PolicyPopupLink>
          </li>

          {state.fieldErrors.privacyAgreed ? (
            <li>
              <p className="dec--04 text-[#fe6b00]">{state.fieldErrors.privacyAgreed}</p>
            </li>
          ) : null}
        </ul>

        <div className="inquiry-btn-bx mt-10 lg:mt-13">
          <SubmitButton />
        </div>

        <p
          ref={alertRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={`dec--04 mt-6 text-center outline-none ${
            state.status === 'idle' ? 'sr-only' : ''
          } ${state.status === 'success' ? 'text-[#333]' : 'text-[#fe6b00]'}`}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
