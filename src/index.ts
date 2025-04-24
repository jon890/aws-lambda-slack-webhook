import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { orderStatusChangeParser } from "./parser/orderStatusChangeParser";
import { SlackService } from "./services/slackService";
import type { OrderStatusChangeData } from "./types/orderStatus";
import {
  getOrderCreationWebhookUrl,
  getOrderStatusChangeWebhookUrl,
} from "./utils/envUtils";
import {
  EVENT_TYPES,
  EventData,
  getParserForEventType,
  parseEventType,
} from "./utils/eventTypeParser";
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
    if (!event.body) {
      return createErrorResponse(400, "요청 본문이 필요합니다.");
    }

    const eventType = parseEventType(event);
    if (!eventType) {
      return createErrorResponse(400, "유효한 이벤트 타입이 필요합니다.");
    }

    const parsedBody = JSON.parse(event.body);

    const orderCreationService = new SlackService(getOrderCreationWebhookUrl());
    const statusChangeService = new SlackService(
      getOrderStatusChangeWebhookUrl()
    );

    let success = false;

    switch (eventType) {
      case EVENT_TYPES.CREATE_ORDER: {
        const parser = getParserForEventType(eventType);
        const slackMessage = parser.parse(parsedBody);
        success = await orderCreationService.sendMessage(slackMessage);
        break;
      }

      case EVENT_TYPES.CAFE24_ORDER: {
        const parser = getParserForEventType(eventType);
        const slackMessage = parser.parse(parsedBody);
        success = await orderCreationService.sendMessage(slackMessage);
        break;
      }

      case EVENT_TYPES.ORDER_STATUS_CHANGE: {
        const orderStatusChangeData = parsedBody as OrderStatusChangeData[];

        for (const datum of orderStatusChangeData) {
          const slackMessage = orderStatusChangeParser.parse(datum);

          if (datum.orderStatusType === "CANCEL_DONE") {
            success = await orderCreationService.sendMessage(slackMessage);
            success = await statusChangeService.sendMessage(slackMessage);
          } else {
            success = await statusChangeService.sendMessage(slackMessage);
          }
        }
        break;
      }

      default:
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
      console.error(
        "웹훅 처리 중 오류가 발생했습니다.",
        "body",
        event.body,
        "eventType",
        eventType
      );
      return createErrorResponse(500, "메시지 전송 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error(
      "웹훅 처리 중 오류가 발생했습니다.",
      error,
      "body",
      event.body
    );
    return createErrorResponse(
      500,
      error instanceof Error
        ? error.message
        : "요청 처리 중 오류가 발생했습니다."
    );
  }
};
