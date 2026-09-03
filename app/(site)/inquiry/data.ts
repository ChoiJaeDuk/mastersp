/**
 * 고객문의 데이터 조회/등록
 *
 * 레거시: lib/board/board_ajax_proc_front.php ($formmode = 'save', $tablename = 'tb_inquiry')
 * 레거시는 INSERT 후 max(uid) 를 다시 읽어 UPDATE 하는 2단계 처리였으나,
 * 여기서는 INSERT 한 번으로 끝내고 AUTO_INCREMENT 값(insertId)을 그대로 쓴다.
 */
import { execute, query, SQL } from '@/lib/db';

export type InquiryInput = {
  inqFldNm: string;
  coNm: string;
  pstnNm: string;
  wrtrNm: string;
  wrtrTelno: string;
  wrtrEml: string;
  inqCtt: string;
  wrtrIp: string | null;
};

/**
 * 고객문의 등록
 *
 * @returns 등록된 문의 일련번호
 */
export async function insertInquiry(input: InquiryInput): Promise<number> {
  const { insertId } = await execute(SQL`
    INSERT INTO TBL_HP_INQUIRY (
      INQ_FLD_NM,
      CO_NM,
      PSTN_NM,
      WRTR_NM,
      WRTR_TELNO,
      WRTR_EML,
      INQ_CTT,
      PRVC_AGRE_DT,
      WRTR_IP
    ) VALUES (
      ${input.inqFldNm},
      ${input.coNm},
      ${input.pstnNm},
      ${input.wrtrNm},
      ${input.wrtrTelno},
      ${input.wrtrEml},
      ${input.inqCtt},
      NOW(),
      ${input.wrtrIp}
    )
  `);

  return insertId;
}

/**
 * 같은 IP 로 최근 N 분 이내에 등록된 문의 건수
 * 레거시의 자동입력방지코드(캡차)를 대신하는 간단한 도배 방지 장치다.
 */
export async function countRecentInquiryByIp(ip: string, minutes: number): Promise<number> {
  // INTERVAL 뒤에는 바인딩을 쓰지 않고, 호출부에서 넘긴 값을 정수로 고정해 넣는다.
  const windowMinutes = Math.max(1, Math.floor(minutes));

  const rows = await query<{ CNT: number }>(SQL`
    SELECT COUNT(*) AS CNT
      FROM TBL_HP_INQUIRY
     WHERE WRTR_IP = ${ip}
       AND FRST_REG_DT > DATE_SUB(NOW(), INTERVAL
  `.append(`${windowMinutes} MINUTE)`));

  return rows[0]?.CNT ?? 0;
}
