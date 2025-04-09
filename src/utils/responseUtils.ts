import { APIGatewayProxyResult } from "aws-lambda";

/**
 * 에러 응답 생성
 * @param statusCode HTTP 상태 코드
 * @param message 에러 메시지
 * @returns API Gateway 프록시 통합에 맞는 응답 형식
 */
export function createErrorResponse(
  statusCode: number,
  message: string
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: message }),
    isBase64Encoded: false,
  };
}

/**
 * 성공 응답 생성
 * @param data 응답 데이터
 * @returns API Gateway 프록시 통합에 맞는 응답 형식
 */
export function createSuccessResponse(data: any): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    isBase64Encoded: false,
  };
}
