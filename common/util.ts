/**
 * 공통 유틸
 *
 * osca 프로젝트의 common/util.js 와 같은 자리의 파일이다.
 */

/**
 * 휴대폰/전화번호에 하이픈을 넣는다.
 * 원본 inquiry.html 의 .AutoHyphen 스크립트를 대체한다.
 *
 * @example formatPhone('01012345678') // '010-1234-5678'
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 11);

  // 02 국번은 지역번호가 2자리다.
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/**
 * 날짜를 구분자로 이어 붙인다.
 * 원본 INC 의 $common->dateStyle() 을 대체한다.
 *
 * @example formatDate('2024-01-05', '.') // '2024.01.05'
 */
export function formatDate(value: string | Date | null | undefined, delimiter = '.'): string {
  if (!value) return '';

  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
  const matched = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!matched) return text;

  return `${matched[1]}${delimiter}${matched[2]}${delimiter}${matched[3]}`;
}

/** 일시를 'YYYY.MM.DD HH:mm' 형태로 표기한다. */
export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
