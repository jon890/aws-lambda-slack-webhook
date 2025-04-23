import { APIGatewayProxyEvent } from "aws-lambda";
import { cafe24OrderParser } from "../parser/cafe24OrderParser";
import { orderEventParser } from "../parser/orderEventParser";
import { orderStatusChangeParser } from "../parser/orderStatusChangeParser";
import type { Cafe24OrderEventData } from "../types/cafe24";
import type { OrderEventData } from "../types/order";
import type { OrderStatusChangeData } from "../types/orderStatus";
import type { EventParser } from "../types/parser";

/**
 * 이벤트 타입 상수
 */
export const EVENT_TYPES = {
  CREATE_ORDER: "CREATE_ORDER",
  ORDER_STATUS_CHANGE: "ORDER_STATUS_CHANGE",
  CAFE24_ORDER: "CAFE24_ORDER",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/**
 * 이벤트 타입별 데이터 타입 정의
 */
export type EventData = {
  [EVENT_TYPES.CREATE_ORDER]: OrderEventData;
  [EVENT_TYPES.ORDER_STATUS_CHANGE]: OrderStatusChangeData[];
  [EVENT_TYPES.CAFE24_ORDER]: Cafe24OrderEventData;
};

// 각 이벤트 타입별 파서 인터페이스 맵 타입 정의
type EventParsersMap = {
  [EVENT_TYPES.CREATE_ORDER]: EventParser<OrderEventData>;
  [EVENT_TYPES.ORDER_STATUS_CHANGE]: {
    parse(
      data: OrderStatusChangeData[]
    ): ReturnType<typeof orderStatusChangeParser.parse>;
  };
  [EVENT_TYPES.CAFE24_ORDER]: EventParser<Cafe24OrderEventData>;
};

/**
 * 이벤트 타입별 파서 매핑
 */
export const EVENT_PARSERS: EventParsersMap = {
  [EVENT_TYPES.CREATE_ORDER]: orderEventParser,
  [EVENT_TYPES.ORDER_STATUS_CHANGE]: {
    parse: (data: OrderStatusChangeData[]) => {
      // 주문 상태 변경 이벤트는 배열로 들어오므로, 여기서는 첫 번째 항목만 처리
      // 실제 처리는 개별 이벤트로 index.ts에서 수행
      return orderStatusChangeParser.parse(data[0]);
    },
  },
  [EVENT_TYPES.CAFE24_ORDER]: cafe24OrderParser,
};

/**
 * API Gateway 이벤트에서 이벤트 타입을 파싱하는 함수
 * @param event API Gateway 이벤트
 * @returns 이벤트 타입 또는 null (이벤트 타입이 없는 경우)
 */
export function parseEventType(event: APIGatewayProxyEvent) {
  const queryParams = event.queryStringParameters || {};

  if (!queryParams.eventType) {
    return null;
  }

  const eventType = queryParams.eventType;

  if (Object.values(EVENT_TYPES).includes(eventType as EventType)) {
    return eventType as EventType;
  }

  return null;
}

/**
 * 이벤트 타입에 맞는 파서를 가져오는 함수
 * @param type 이벤트 타입
 * @returns 해당 이벤트 타입에 맞는 파서
 */
export function getParserForEventType<T extends EventType>(
  type: T
): EventParsersMap[T] {
  return EVENT_PARSERS[type];
}
