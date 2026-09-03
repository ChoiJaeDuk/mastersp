/**
 * 메일 발송 (레거시 lib/util/PHPMailer 대체)
 *
 * SMTP 정보는 .env.local 에서 읽는다. 값이 비어 있으면 발송을 건너뛰고 경고만 남긴다.
 * (개발 환경에서 SMTP 없이도 문의 등록이 실패하지 않도록 하기 위함)
 */
import nodemailer, { type Transporter } from 'nodemailer';

declare global {
  var __mastersp_mail_transporter__: Transporter | undefined;
}

/** SMTP 설정이 모두 채워졌는지 확인한다. */
function isConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransporter(): Transporter | null {
  if (!isConfigured()) return null;

  if (!global.__mastersp_mail_transporter__) {
    global.__mastersp_mail_transporter__ = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return global.__mastersp_mail_transporter__;
}

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * 메일 발송
 *
 * 호출부(문의 접수 등)가 메일 실패로 막히면 안 되므로 예외를 삼키고 성공 여부만 돌려준다.
 *
 * @returns 발송 성공 여부
 */
export async function sendMail({ to, subject, html, replyTo }: SendMailParams): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('[mail] SMTP 환경 변수가 설정되지 않아 발송을 건너뜁니다 :', subject);
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
      to,
      subject,
      html,
      replyTo,
    });

    return true;
  } catch (error) {
    console.error('[mail] 발송 실패 :', error);
    return false;
  }
}

/** 공통 메일 레이아웃 (레거시 답변 메일 템플릿의 구조를 유지) */
export function wrapMailLayout(title: string, bodyHtml: string): string {
  return `
    <div style="max-width:600px;margin:0 auto;font-family:'Malgun Gothic',sans-serif;color:#333;">
      <h2 style="font-size:20px;font-weight:600;letter-spacing:-0.01em;margin:0 0 24px;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top:32px;text-align:center;">
        <a href="https://www.masterspace.co.kr" target="_blank" rel="noreferrer"
           style="display:inline-block;padding:10px 20px;min-width:140px;text-align:center;
                  background:#fe6b00;color:#fff;font-size:16px;text-decoration:none;">홈페이지 &gt;</a>
      </p>
    </div>
  `;
}
