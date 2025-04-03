import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SlackService } from "./services/slackService";
import { transformToSlackMessage } from "./utils/transformUtils";
import { getSlackWebhookUrl } from "./utils/envUtils";
import { ExternalRequestData, LambdaResponse } from "./types";

/**
 * 에러 응답 생성
 * @param statusCode HTTP 상태 코드
 * @param message 에러 메시지
 * @returns
 */
function createErrorResponse(
  statusCode: number,
  message: string
): LambdaResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: message }),
  };
}

/**
 * 성공 응답 생성
 * @param data 응답 데이터
 * @returns
 */
function createSuccessResponse(data: any): LambdaResponse {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

/**
 * AWS Lambda 핸들러 함수
 * @param event API Gateway 이벤트
 * @returns Lambda 응답
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("요청 수신:", JSON.stringify(event));

    // 요청 본문 확인
    if (!event.body) {
      return createErrorResponse(400, "요청 본문이 필요합니다");
    }

    // 요청 데이터 파싱
    let requestData: ExternalRequestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (error) {
      return createErrorResponse(400, "유효하지 않은 JSON 형식입니다");
    }

    // Slack 웹훅 URL 가져오기
    const webhookUrl = getSlackWebhookUrl();
    const slackService = new SlackService(webhookUrl);

    // 데이터 변환
    const slackMessage = transformToSlackMessage(requestData);

    // Slack 메시지 전송
    const response = await slackService.sendMessage(slackMessage);

    return createSuccessResponse({
      message: "Slack 메시지가 성공적으로 전송되었습니다",
      status: response.status,
    });
  } catch (error) {
    console.error("Error:", error);
    return createErrorResponse(
      500,
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"
    );
  }
};
