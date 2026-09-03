/**
 * 고객문의 데이터 조회/등록
 *
 * 레거시 운영 DB(masterspace_co_kr)의 tb_inquiry 에 직접 저장한다.
 * 기존 PHP 관리자(sadmin)에서 그대로 확인·답변할 수 있게 하기 위한 것이다.
 *
 * 레거시: lib/board/board_ajax_proc_front.php ($formmode='save', $tablename='tb_inquiry')
 *   원본은 INSERT 후 max(uid) 를 다시 읽어 UPDATE 하는 2단계였으나(경합 위험),
 *   여기서는 INSERT 한 번으로 끝내고 AUTO_INCREMENT 값을 그대로 쓴다.
 *
 * 컬럼 매핑 (원본 폼과 동일)
 *   title        <- 문의분야     field_etc_01 <- 회사명
 *   field_etc_02 <- 직함         uname/utel/uemail <- 이름/연락처/이메일
 *   content      <- 문의내용     field_etc_03 <- 등록 IP (도배 방지용, 원본은 미사용 여유 컬럼)
 *
 * tb_inquiry 는 NOT NULL 인데 DEFAULT 가 없는 컬럼이 13개다.
 * 운영 서버 sql_mode 가 비엄격이라 생략해도 들어가지만, 나중에 STRICT 로 바뀌어도
 * 깨지지 않도록 필요한 값을 모두 명시한다.
 */
import { execute, isDbConfigured, query, SQL } from '@/lib/db';

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
 * @returns 등록된 문의 일련번호 (tb_inquiry.uid)
 */
export async function insertInquiry(input: InquiryInput): Promise<number> {
  const { insertId } = await execute(SQL`
    INSERT INTO tb_inquiry (
      lantype, viewtype, mode, mid, pass,
      title, field_etc_01, field_etc_02,
      uname, utel, uemail,
      content, content1,
      field_etc_03, field_etc_04, field_etc_05, field_etc_06, field_etc_07,
      field_etc_08, field_etc_09, field_etc_10,
      reg_date
    ) VALUES (
      '1', 'Y', '', '', '',
      ${input.inqFldNm}, ${input.coNm}, ${input.pstnNm},
      ${input.wrtrNm}, ${input.wrtrTelno}, ${input.wrtrEml},
      ${input.inqCtt}, '',
      ${input.wrtrIp ?? ''}, '', '', '', '',
      '', '', '',
      NOW()
    )
  `);

  return insertId;
}

/**
 * 같은 IP 로 최근 N 분 이내에 등록된 문의 건수
 * 레거시의 자동입력방지코드(캡차)를 대신하는 간단한 도배 방지 장치다.
 */
export async function countRecentInquiryByIp(ip: string, minutes: number): Promise<number> {
  if (!isDbConfigured()) return 0;

  // INTERVAL 뒤에는 바인딩을 쓰지 않고, 호출부에서 넘긴 값을 정수로 고정해 넣는다.
  const windowMinutes = Math.max(1, Math.floor(minutes));

  const rows = await query<{ CNT: number }>(SQL`
    SELECT COUNT(*) AS CNT
      FROM tb_inquiry
     WHERE field_etc_03 = ${ip}
       AND reg_date > DATE_SUB(NOW(), INTERVAL
  `.append(`${windowMinutes} MINUTE)`));

  return rows[0]?.CNT ?? 0;
}
