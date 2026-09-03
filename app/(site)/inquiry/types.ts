/**
 * 고객문의 폼 상태 타입
 *
 * 'use server' 모듈은 async 함수만 export 할 수 있으므로,
 * 액션과 함께 쓰는 상수/타입은 이 파일에 둔다.
 */

export type InquiryFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  /** 필드별 첫 번째 오류 메시지 */
  fieldErrors: Record<string, string>;
};

export const initialInquiryFormState: InquiryFormState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
};
