import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SlackService } from "./services/slackService";
import { OrderEventData, OrderStatusChangeData, SlackMessage } from "./types";
import { getSlackWebhookUrl } from "./utils/envUtils";
import {
  createErrorResponse,
  createSuccessResponse,
} from "./utils/responseUtils";
import {
  transformOrderEventToSlackMessage,
  transformOrderStatusChangeToSlackMessage,
} from "./utils/transformUtils";

/**
 * AWS Lambda 핸들러 함수
 * @param event API Gateway 이벤트
 * @returns Lambda 응답
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Slack 웹훅 URL 가져오기
    const webhookUrl = getSlackWebhookUrl();
    const slackService = new SlackService(webhookUrl);

    // 데이터 변환
    let slackMessage: SlackMessage;
    let responseMessage = "";

    // 쿼리 파라미터에서 이벤트 타입 확인
    const queryParams = event.queryStringParameters || {};
    const eventType = queryParams.eventType || "";

    let requestBody = JSON.parse(event.body ?? "{}");

    switch (eventType.toUpperCase()) {
      case "ORDER_CREATE":
        if (requestBody.eventType === "CREATE_ORDER") {
          slackMessage = transformOrderEventToSlackMessage(
            requestBody as OrderEventData
          );
          await slackService.sendMessage(slackMessage);
          responseMessage = "주문 생성 이벤트가 성공적으로 처리되었습니다";
        } else {
          return createErrorResponse(
            400,
            "올바른 주문 생성 이벤트 형식이 아닙니다"
          );
        }
        break;

      case "ORDER_STATUS_CHANGE":
        const orderStatusChangeData = requestBody as OrderStatusChangeData[];

        for (const data of orderStatusChangeData) {
          slackMessage = transformOrderStatusChangeToSlackMessage(data);
          await slackService.sendMessage(slackMessage);
        }

        responseMessage = "주문 상태 변경 이벤트가 성공적으로 처리되었습니다";
        break;

      default:
        return createErrorResponse(400, "지원하지 않는 이벤트 타입입니다");
    }

    return createSuccessResponse({
      message: responseMessage,
      status: 200,
    });
  } catch (error) {
    console.log("Error processing event:", error);
    return createErrorResponse(
      500,
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"
    );
  }
};
