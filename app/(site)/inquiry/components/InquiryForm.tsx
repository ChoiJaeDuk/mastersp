'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { formatPhone } from '@/common/util';
import { createInquiry } from '../actions';
import { initialInquiryFormState } from '../types';

/** 입력 항목 정의 (레거시 inquiry.html 의 form-body ul 과 동일 순서) */
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

const inputClass =
  'mt-2 w-full border border-[#ddd] bg-white px-4 py-3.5 text-[0.9375rem] text-ink ' +
  'outline-none transition-colors placeholder:text-[#aaa] focus:border-brand';

/** 제출 버튼 — 서버 액션 진행 중에는 비활성화하고 로딩 상태를 노출한다. */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-w-[12.5rem] items-center justify-center gap-2 bg-ink px-10 py-4
                 text-[1rem] font-semibold text-white transition-colors hover:bg-brand
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          접수 중...
        </>
      ) : (
        '문의하기'
      )}
    </button>
  );
}

/**
 * 고객문의 등록 폼 (Client Component)
 * 원본: kor/inquiry/inquiry.html 의 #signform
 */
export default function InquiryForm() {
  const [state, formAction] = useActionState(createInquiry, initialInquiryFormState);
  const [phone, setPhone] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);

  // 접수 성공 시 폼을 비우고 결과 메시지로 포커스를 옮긴다.
  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
      setPhone('');
    }

    if (state.status !== 'idle') {
      alertRef.current?.focus();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <ul className="space-y-6">
        {FIELDS.map((field) => (
          <li key={field.name}>
            <label htmlFor={field.name} className="text-[0.9375rem] font-bold text-ink">
              {field.label}
              <span className="ml-1 text-brand">*</span>
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required
              aria-invalid={Boolean(state.fieldErrors[field.name])}
              aria-describedby={state.fieldErrors[field.name] ? `${field.name}-error` : undefined}
              className={inputClass}
              {...(field.name === 'wrtrTelno'
                ? {
                    value: phone,
                    onChange: (event) => setPhone(formatPhone(event.target.value)),
                    inputMode: 'numeric' as const,
                  }
                : {})}
            />
            {state.fieldErrors[field.name] ? (
              <p id={`${field.name}-error`} className="mt-1.5 text-sm text-brand">
                {state.fieldErrors[field.name]}
              </p>
            ) : null}
          </li>
        ))}

        <li>
          <label htmlFor="inqCtt" className="text-[0.9375rem] font-bold text-ink">
            문의내용
            <span className="ml-1 text-brand">*</span>
          </label>
          <textarea
            id="inqCtt"
            name="inqCtt"
            rows={6}
            placeholder="문의하실 내용을 입력해주세요."
            required
            aria-invalid={Boolean(state.fieldErrors.inqCtt)}
            aria-describedby={state.fieldErrors.inqCtt ? 'inqCtt-error' : undefined}
            className={`${inputClass} resize-y`}
          />
          {state.fieldErrors.inqCtt ? (
            <p id="inqCtt-error" className="mt-1.5 text-sm text-brand">
              {state.fieldErrors.inqCtt}
            </p>
          ) : null}
        </li>

        <li>
          <div className="flex items-start gap-2">
            <input
              id="privacyAgreed"
              name="privacyAgreed"
              type="checkbox"
              value="Y"
              className="mt-1 size-4 accent-[#fe6b00]"
              aria-describedby={state.fieldErrors.privacyAgreed ? 'privacyAgreed-error' : undefined}
            />
            <label htmlFor="privacyAgreed" className="text-[0.9375rem] leading-relaxed text-shell">
              [필수] 개인정보 수집 및 이용에 동의합니다.
              <Link
                href="/policy/privacy"
                className="ml-1 underline underline-offset-2 hover:text-brand"
              >
                [전문보기]
              </Link>
            </label>
          </div>
          {state.fieldErrors.privacyAgreed ? (
            <p id="privacyAgreed-error" className="mt-1.5 text-sm text-brand">
              {state.fieldErrors.privacyAgreed}
            </p>
          ) : null}
        </li>
      </ul>

      <div className="mt-10 text-center lg:mt-13">
        <SubmitButton />
      </div>

      {/* 서버 액션 결과 알림 */}
      <p
        ref={alertRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={`mt-6 text-center text-[0.9375rem] outline-none ${
          state.status === 'success' ? 'text-ink' : 'text-brand'
        } ${state.status === 'idle' ? 'sr-only' : ''}`}
      >
        {state.message}
      </p>
    </form>
  );
}
