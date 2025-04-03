import * as dotenv from "dotenv";

// 로컬 개발 환경에서만 .env 파일 로드
// AWS Lambda 환경에서는 환경 변수가 Lambda 콘솔에서 설정됨
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

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
 * 슬랙 웹훅 URL 가져오기
 * @returns Slack Webhook URL
 */
export function getSlackWebhookUrl(): string {
  return getEnv("SLACK_WEBHOOK_URL", true);
}

/**
 * 현재 환경 가져오기
 * @returns 현재 실행 환경 (development, production 등)
 */
export function getNodeEnv(): string {
  return getEnv("NODE_ENV", false) || "development";
}
