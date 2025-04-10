/**
 * 환경 변수 가져오기
 * @param name 환경 변수 이름
 * @param required 필수 여부
 * @returns 환경 변수 값
 */
export function getEnv(name: string, required: boolean = false): string {
  const value = process.env[name];

  if (required && !value) {
    throw new Error(`필수 환경 변수 ${name}이(가) 설정되지 않았습니다.`);
  }

  return value || "";
}

/**
 * 주문 생성 채널의 슬랙 웹훅 URL을 반환하는 함수
 * @returns 주문 생성 채널의 슬랙 웹훅 URL
 */
export function getOrderCreationWebhookUrl(): string {
  return getEnv("SLACK_ORDER_CREATE_WEBHOOK_URL", true);
}

/**
 * 주문 상태 변경 채널의 슬랙 웹훅 URL을 반환하는 함수
 * @returns 주문 상태 변경 채널의 슬랙 웹훅 URL
 */
export function getOrderStatusChangeWebhookUrl(): string {
  return getEnv("SLACK_ORDER_STATUS_CHANGE_WEBHOOK_URL", true);
}

/**
 * 현재 환경 가져오기
 * @returns 현재 실행 환경 (development, production 등)
 */
export function getNodeEnv(): string {
  return process.env.NODE_ENV || "development";
}
