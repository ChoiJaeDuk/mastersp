/**
 * 고객문의 서버 액션
 *
 * 레거시 흐름(jQuery ajax → board_ajax_proc_front.php → JSON 응답)을
 * Next.js Server Action 으로 대체한다.
 */
'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

import { sendMail, wrapMailLayout } from '@/lib/mail';
import { COMPANY_INFO } from '@/lib/navigation';
import * as data from './data';
import type { InquiryFormState } from './types';

/** 같은 IP 에서 이 시간(분) 안에 허용하는 최대 등록 건수 */
const SPAM_WINDOW_MINUTES = 10;
const SPAM_LIMIT = 3;

const inquirySchema = z.object({
  inqFldNm: z.string().trim().min(1, '문의분야를 입력해 주세요.').max(255),
  coNm: z.string().trim().min(1, '회사명을 입력해 주세요.').max(255),
  pstnNm: z.string().trim().min(1, '직함을 입력해 주세요.').max(255),
  wrtrNm: z.string().trim().min(1, '이름을 입력해 주세요.').max(50),
  wrtrTelno: z
    .string()
    .trim()
    .min(1, '연락처를 입력해 주세요.')
    .refine((value) => /^[0-9-]{9,20}$/.test(value), '연락처 형식이 올바르지 않습니다.'),
  wrtrEml: z
    .string()
    .trim()
    .min(1, '이메일을 입력해 주세요.')
    .max(250)
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), '이메일 형식이 올바르지 않습니다.'),
  inqCtt: z.string().trim().min(1, '문의내용을 입력해 주세요.').max(5000),
  privacyAgreed: z.literal('Y', { error: '개인정보 수집 및 이용에 동의해 주세요.' }),
});

/** 요청 헤더에서 클라이언트 IP 를 추출한다. */
async function getClientIp(): Promise<string | null> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');

  if (forwarded) return forwarded.split(',')[0].trim();

  return headerList.get('x-real-ip');
}

/**
 * 고객문의 등록
 *
 * useActionState 와 함께 사용한다.
 */
export async function createInquiry(
  _prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const parsed = inquirySchema.safeParse({
    inqFldNm: formData.get('inqFldNm'),
    coNm: formData.get('coNm'),
    pstnNm: formData.get('pstnNm'),
    wrtrNm: formData.get('wrtrNm'),
    wrtrTelno: formData.get('wrtrTelno'),
    wrtrEml: formData.get('wrtrEml'),
    inqCtt: formData.get('inqCtt'),
    privacyAgreed: formData.get('privacyAgreed'),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }

    return {
      status: 'error',
      message: '입력 내용을 확인해 주세요.',
      fieldErrors,
    };
  }

  const clientIp = await getClientIp();

  try {
    // 도배 방지 (레거시의 자동입력방지코드 대체)
    if (clientIp) {
      const recentCount = await data.countRecentInquiryByIp(clientIp, SPAM_WINDOW_MINUTES);

      if (recentCount >= SPAM_LIMIT) {
        return {
          status: 'error',
          message: `잠시 후 다시 시도해 주세요. (${SPAM_WINDOW_MINUTES}분 내 최대 ${SPAM_LIMIT}건)`,
          fieldErrors: {},
        };
      }
    }

    const inqSqno = await data.insertInquiry({
      inqFldNm: parsed.data.inqFldNm,
      coNm: parsed.data.coNm,
      pstnNm: parsed.data.pstnNm,
      wrtrNm: parsed.data.wrtrNm,
      wrtrTelno: parsed.data.wrtrTelno,
      wrtrEml: parsed.data.wrtrEml,
      inqCtt: parsed.data.inqCtt,
      wrtrIp: clientIp,
    });

    await notifyAdmin(inqSqno, parsed.data);

    return {
      status: 'success',
      message: '문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.',
      fieldErrors: {},
    };
  } catch (error) {
    console.error('Failed to create inquiry :', error);

    return {
      status: 'error',
      message: '문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      fieldErrors: {},
    };
  }
}

/** 담당자에게 접수 알림 메일을 보낸다. 실패해도 문의 접수 자체는 성공 처리한다. */
async function notifyAdmin(inqSqno: number, input: z.infer<typeof inquirySchema>) {
  const to = process.env.MAIL_ADMIN_TO ?? COMPANY_INFO.email;

  const rows: Array<[string, string]> = [
    ['문의분야', input.inqFldNm],
    ['회사명', input.coNm],
    ['직함', input.pstnNm],
    ['이름', input.wrtrNm],
    ['연락처', input.wrtrTelno],
    ['이메일', input.wrtrEml],
  ];

  const body = `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <th style="width:110px;padding:8px 0;text-align:left;color:#888;font-weight:400;">${label}</th>
          <td style="padding:8px 0;">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join('')}
      <tr>
        <th style="padding:8px 0;text-align:left;vertical-align:top;color:#888;font-weight:400;">문의내용</th>
        <td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(input.inqCtt)}</td>
      </tr>
    </table>
  `;

  await sendMail({
    to,
    subject: `[홈페이지 문의 #${inqSqno}] ${input.inqFldNm}`,
    html: wrapMailLayout('새로운 고객문의가 접수되었습니다.', body),
    replyTo: input.wrtrEml,
  });
}

/** 메일 본문에 사용자 입력을 넣기 전 HTML 특수문자를 이스케이프한다. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
