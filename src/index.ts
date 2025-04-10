import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { OrderEventData, OrderStatusChangeData } from "./types";
import {
  transformOrderEventToSlackMessage,
  transformOrderStatusChangeToSlackMessage,
} from "./utils/transformUtils";
import { SlackService } from "./services/slackService";
import {
  getOrderCreationWebhookUrl,
  getOrderStatusChangeWebhookUrl,
} from "./utils/envUtils";
import {
  createErrorResponse,
  createSuccessResponse,
} from "./utils/responseUtils";

/**
 * Lambda 핸들러 함수
 * @param event API Gateway 이벤트
 * @returns API Gateway 응답
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // 요청 바디가 없는 경우 처리
    if (!event.body) {
      return createErrorResponse(400, "요청 본문이 필요합니다.");
    }

    // 요청 바디 파싱
    const parsedBody = JSON.parse(event.body);

    // 이벤트 타입 확인
    const eventType = parsedBody.eventType;

    if (!eventType) {
      return createErrorResponse(400, "eventType 필드가 필요합니다.");
    }

    // 슬랙 서비스 인스턴스 미리 생성
    const orderCreationWebhook = getOrderCreationWebhookUrl();
    const statusChangeWebhook = getOrderStatusChangeWebhookUrl();

    const orderCreationService = new SlackService(orderCreationWebhook);
    const statusChangeService = new SlackService(statusChangeWebhook);

    let success = false;

    // 이벤트 타입에 따라 처리
    if (eventType === "CREATE_ORDER") {
      // 주문 생성 이벤트 처리
      const orderEventData = parsedBody as OrderEventData;
      const slackMessage = transformOrderEventToSlackMessage(orderEventData);

      // 주문 생성 채널로 메시지 전송
      success = await orderCreationService.sendMessage(slackMessage);
    } else if (eventType === "CHANGE_ORDER_STATUS") {
      // 주문 상태 변경 이벤트 처리
      const orderStatusChangeData = parsedBody as OrderStatusChangeData;
      const slackMessage = transformOrderStatusChangeToSlackMessage(
        orderStatusChangeData
      );

      // 주문 상태에 따라 적절한 채널로 메시지 전송
      if (orderStatusChangeData.orderStatusType === "CANCEL_DONE") {
        // 취소 상태는 주문 생성 채널로만 전송
        success = await orderCreationService.sendMessage(slackMessage);
      } else {
        // 그 외 상태 변경은 상태 변경 채널로만 전송
        success = await statusChangeService.sendMessage(slackMessage);
      }
    } else {
      // 지원하지 않는 이벤트 타입
      return createErrorResponse(
        400,
        `지원하지 않는 이벤트 타입: ${eventType}`
      );
    }

    if (success) {
      return createSuccessResponse({
        message: "메시지가 성공적으로 전송되었습니다.",
        status: 200,
      });
    } else {
      return createErrorResponse(500, "메시지 전송 중 오류가 발생했습니다.");
    }
  } catch (error) {
    return createErrorResponse(
      500,
      error instanceof Error
        ? error.message
        : "요청 처리 중 오류가 발생했습니다."
    );
  }
};
