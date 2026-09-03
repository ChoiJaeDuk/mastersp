/**
 * 고객문의 관리 서버 액션
 *
 * 레거시 board_ajax_proc.php 의 case 'reply' (답변 저장 + PHPMailer 회신)를 옮긴 것이다.
 */
'use server';

import { execute, SQL } from '@/lib/db';
import { requireUserId } from '@/common/session';
import { runGridSave, toNumberOrNull } from '@/common/gridSave';
import type { GridRow } from '@/common/gridFns';
import type { GridChanges, GridSaveResult } from '@/hooks/useGridHandler';
import { sendMail, wrapMailLayout } from '@/lib/mail';

import * as data from './data';

export async function getInquiryList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectInquiryList() as Promise<GridRow[]>;
}

export async function getInquiry(inqSqno: number) {
  await requireUserId();

  return data.selectInquiry(inqSqno);
}

/** 목록 그리드에서는 삭제만 처리한다. (소프트 삭제) */
export async function saveInquiryList(changes: GridChanges): Promise<GridSaveResult> {
  const userId = await requireUserId();

  return runGridSave(changes, userId, {
    async remove(client, row, changer) {
      await client.query(SQL`
        UPDATE TBL_HP_INQUIRY
           SET DEL_YN = 'Y',
               LST_CHG_DT = NOW(),
               LST_CHGR_EMPNO = ${changer}
         WHERE INQ_SQNO = ${toNumberOrNull(row.INQ_SQNO)}
      `);
    },
  });
}

export type ReplyResult = {
  success: boolean;
  message: string;
  /** 회신 메일 발송 여부 */
  mailSent: boolean;
};

/**
 * 답변 저장 (+ 신청자에게 회신 메일)
 *
 * @param inqSqno  문의 일련번호
 * @param replyCtt 답변 내용
 * @param sendMailToWriter 신청자에게 메일을 보낼지 여부
 */
export async function replyInquiry(
  inqSqno: number,
  replyCtt: string,
  sendMailToWriter: boolean,
): Promise<ReplyResult> {
  const userId = await requireUserId();

  const content = replyCtt.trim();

  if (content === '') {
    return { success: false, message: '답변 내용을 입력해 주세요.', mailSent: false };
  }

  const inquiry = await data.selectInquiry(inqSqno);

  if (!inquiry) {
    return { success: false, message: '문의를 찾을 수 없습니다.', mailSent: false };
  }

  try {
    await execute(SQL`
      UPDATE TBL_HP_INQUIRY
         SET RPLY_CTT = ${content},
             RPLY_DT = NOW(),
             RPLY_USER_ID = ${userId},
             PRCS_STS_CD = 'DONE',
             LST_CHG_DT = NOW(),
             LST_CHGR_EMPNO = ${userId}
       WHERE INQ_SQNO = ${inqSqno}
    `);
  } catch (error) {
    console.error('Failed to reply inquiry :', error);

    return { success: false, message: '답변 저장 중 오류가 발생했습니다.', mailSent: false };
  }

  let mailSent = false;

  if (sendMailToWriter) {
    const body = `
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <th style="width:90px;padding:8px 0;text-align:left;vertical-align:top;color:#888;font-weight:400;">문의내용</th>
          <td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(inquiry.INQ_CTT)}</td>
        </tr>
        <tr>
          <th style="padding:8px 0;text-align:left;vertical-align:top;color:#888;font-weight:400;">답변내용</th>
          <td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(content)}</td>
        </tr>
      </table>
    `;

    mailSent = await sendMail({
      to: inquiry.WRTR_EML,
      subject: `[장인의공간] 문의하신 내용에 대한 답변입니다.`,
      html: wrapMailLayout(`${inquiry.WRTR_NM}님, 문의에 대한 답변입니다.`, body),
    });
  }

  return {
    success: true,
    message: sendMailToWriter
      ? mailSent
        ? '답변을 저장하고 회신 메일을 발송했습니다.'
        : '답변은 저장했지만 메일 발송에 실패했습니다. (SMTP 설정을 확인해 주세요)'
      : '답변을 저장했습니다.',
    mailSent,
  };
}

/** 메일 본문에 사용자 입력을 넣기 전 HTML 특수문자를 이스케이프한다. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
