/**
 * 고객문의 관리 데이터 조회
 */
import { query, queryOne, SQL } from '@/lib/db';

export type InquiryDetail = {
  INQ_SQNO: number;
  INQ_FLD_NM: string;
  CO_NM: string | null;
  PSTN_NM: string | null;
  WRTR_NM: string;
  WRTR_TELNO: string;
  WRTR_EML: string;
  INQ_CTT: string;
  PRCS_STS_CD: string;
  RPLY_CTT: string | null;
  RPLY_DT: string | null;
  RPLY_USER_ID: string | null;
  WRTR_IP: string | null;
  FRST_REG_DT: string;
};

/** 문의 목록 (삭제되지 않은 것) */
export async function selectInquiryList() {
  try {
    return await query(SQL`
      SELECT INQ_SQNO,
             PRCS_STS_CD,
             INQ_FLD_NM,
             CO_NM,
             PSTN_NM,
             WRTR_NM,
             WRTR_TELNO,
             WRTR_EML,
             DATE_FORMAT(FRST_REG_DT, '%Y-%m-%d %H:%i') AS FRST_REG_DT,
             DATE_FORMAT(RPLY_DT, '%Y-%m-%d %H:%i') AS RPLY_DT
        FROM TBL_HP_INQUIRY
       WHERE DEL_YN = 'N'
       ORDER BY FRST_REG_DT DESC
    `);
  } catch (error) {
    console.error('Failed to fetch selectInquiryList :', error);
    return [];
  }
}

/** 문의 상세 */
export async function selectInquiry(inqSqno: number): Promise<InquiryDetail | null> {
  try {
    return await queryOne<InquiryDetail>(SQL`
      SELECT INQ_SQNO,
             INQ_FLD_NM,
             CO_NM,
             PSTN_NM,
             WRTR_NM,
             WRTR_TELNO,
             WRTR_EML,
             INQ_CTT,
             PRCS_STS_CD,
             RPLY_CTT,
             RPLY_USER_ID,
             WRTR_IP,
             DATE_FORMAT(RPLY_DT, '%Y-%m-%d %H:%i') AS RPLY_DT,
             DATE_FORMAT(FRST_REG_DT, '%Y-%m-%d %H:%i') AS FRST_REG_DT
        FROM TBL_HP_INQUIRY
       WHERE INQ_SQNO = ${inqSqno}
         AND DEL_YN = 'N'
    `);
  } catch (error) {
    console.error('Failed to fetch selectInquiry :', error);
    return null;
  }
}
