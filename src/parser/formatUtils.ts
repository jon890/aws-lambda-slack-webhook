import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// dayjs 설정 초기화 함수
export function initializeDayjs() {
  // 플러그인 확장
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // 한국 시간대 설정
  dayjs.tz.setDefault("Asia/Seoul");
}

// 초기화 함수 호출 (실제 환경에서만)
if (process.env.NODE_ENV !== "test") {
  initializeDayjs();
}

/**
 * 주문 금액을 포맷팅하는 함수
 * @param amount 금액
 * @returns 포맷팅된 금액 문자열
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/**
 * 문자열 형태의 금액을 포맷팅하는 함수
 * @param price 문자열 형태의 금액
 * @returns 포맷팅된 금액 문자열
 */
export function formatPrice(price: string): string {
  return parseFloat(price).toLocaleString("ko-KR");
}

/**
 * 결제 수단을 한글로 변환하는 함수
 * @param payType 결제 유형
 * @returns 한글로 변환된 결제 수단
 */
export function getPaymentMethodText(payType: string): string {
  switch (payType.toUpperCase()) {
    case "CREDIT_CARD":
      return "카드";
    case "ACCOUNT":
      return "무통장 입금";
    case "NAVER_PAY":
      return "네이버페이";
    case "KAKAO_PAY":
      return "카카오페이";
    case "PAYCO":
      return "페이코";
    case "ACCUMULATION":
      return "적립금";
    case "MILEAGE":
      return "마일리지";
    default:
      return payType;
  }
}

/**
 * 플랫폼 타입을 변환하는 함수
 * @param platformType 플랫폼 타입
 * @returns 변환된 플랫폼 타입
 */
export function getPlatformTypeText(platformType: string): string {
  switch (platformType.toUpperCase()) {
    case "PC":
    case "PC_WEB":
      return "웹";
    case "MOBILE_WEB":
      return "웹";
    case "MOBILE_APP":
      return "앱";
    default:
      return "웹";
  }
}

/**
 * ISO 형식 날짜 문자열을 읽기 쉬운 형식으로 변환 (YYYY-MM-DD HH:MM)
 * @param isoDateString ISO 형식의 날짜 문자열 (예: 2020-07-17T15:28:14+09:00)
 * @returns 변환된 날짜 문자열 (예: 2020-07-17 15:28)
 */
export function formatDateString(isoDateString: string): string {
  if (!isoDateString) return "";

  try {
    // 먼저 유효한 날짜인지 확인
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // dayjs로 날짜 파싱 후 한국 시간대로 변환하여 포맷팅
    return dayjs(isoDateString).format("YYYY-MM-DD HH:mm");
  } catch (e) {
    // 변환 실패 시 원본 문자열 반환
    console.error("날짜 변환 오류:", e);
    return isoDateString;
  }
}
