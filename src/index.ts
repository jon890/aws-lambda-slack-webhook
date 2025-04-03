import { APIGatewayProxyResult } from "aws-lambda";
import { SlackService } from "./services/slackService";
import { LambdaResponse, OrderEventData } from "./types";
import { getSlackWebhookUrl } from "./utils/envUtils";
import { transformOrderEventToSlackMessage } from "./utils/transformUtils";

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
    body: { error: message },
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
    body: data,
  };
}

/**
 * AWS Lambda 핸들러 함수
 * @param event API Gateway 이벤트가 아닌 직접 전달된 이벤트 데이터
 * @returns Lambda 응답
 */
export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    // Slack 웹훅 URL 가져오기
    const webhookUrl = getSlackWebhookUrl();
    const slackService = new SlackService(webhookUrl);

    // 데이터 변환
    let slackMessage;

    // 요청 타입에 따라 변환 로직 분기
    if (event.eventType && event.eventType === "CREATE_ORDER") {
      slackMessage = transformOrderEventToSlackMessage(event as OrderEventData);

      const response = await slackService.sendMessage(slackMessage);

      return createSuccessResponse({
        message: "Slack 메시지가 성공적으로 전송되었습니다",
        status: response.status,
      });
    } else {
      return createErrorResponse(500, "지원하지 않는 이벤트 타입입니다.");
    }
  } catch (error) {
    return createErrorResponse(
      500,
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"
    );
  }
};
