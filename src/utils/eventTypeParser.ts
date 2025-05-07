import { APIGatewayProxyEvent } from "aws-lambda";
import { cafe24CancelOrderParser } from "../parser/cafe24CancelOrderParser";
import { orderEventParser } from "../parser/orderEventParser";
import { orderStatusChangeParser } from "../parser/orderStatusChangeParser";
import type { Cafe24OrderEventData } from "../types/cafe24";
import type { Cafe24CancelOrderData } from "../types/cafe24CancelOrder";
import type { OrderEventData } from "../types/order";
import type { OrderStatusChangeData } from "../types/orderStatus";
import type { EventParser } from "../types/parser";
import { cafe24CreateOrderParser } from "../parser/cafe24CreateOrderParser";

/**
 * 이벤트 타입 상수
 */
export const EVENT_TYPES = {
  CREATE_ORDER: "CREATE_ORDER",
  ORDER_STATUS_CHANGE: "ORDER_STATUS_CHANGE",
  CAFE24_CREATE_ORDER: "CAFE24_CREATE_ORDER",
  CAFE24_CANCEL_ORDER: "CAFE24_CANCEL_ORDER",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/**
 * Cafe24 이벤트 번호에 따른 이벤트 타입 매핑
 */
export const CAFE24_EVENT_NO_MAP: Record<number, EventType> = {
  90023: EVENT_TYPES.CAFE24_CREATE_ORDER, // 주문 생성 이벤트
  90026: EVENT_TYPES.CAFE24_CANCEL_ORDER, // 주문 취소 이벤트
};

/**
 * 이벤트 타입별 데이터 타입 정의
 */
export type EventData = {
  [EVENT_TYPES.CREATE_ORDER]: OrderEventData;
  [EVENT_TYPES.ORDER_STATUS_CHANGE]: OrderStatusChangeData[];
  [EVENT_TYPES.CAFE24_CREATE_ORDER]: Cafe24OrderEventData;
  [EVENT_TYPES.CAFE24_CANCEL_ORDER]: Cafe24CancelOrderData;
};

// 각 이벤트 타입별 파서 인터페이스 맵 타입 정의
type EventParsersMap = {
  [EVENT_TYPES.CREATE_ORDER]: EventParser<OrderEventData>;
  [EVENT_TYPES.ORDER_STATUS_CHANGE]: {
    parse(
      data: OrderStatusChangeData[]
    ): ReturnType<typeof orderStatusChangeParser.parse>;
  };
  [EVENT_TYPES.CAFE24_CREATE_ORDER]: EventParser<Cafe24OrderEventData>;
  [EVENT_TYPES.CAFE24_CANCEL_ORDER]: EventParser<Cafe24CancelOrderData>;
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
  [EVENT_TYPES.CAFE24_CREATE_ORDER]: cafe24CreateOrderParser,
  [EVENT_TYPES.CAFE24_CANCEL_ORDER]: cafe24CancelOrderParser,
};

/**
 * Cafe24 이벤트 번호를 이벤트 타입으로 변환하는 함수
 * @param eventNo Cafe24 이벤트 번호
 * @returns 이벤트 타입 또는 기본 CAFE24_ORDER 타입
 */
function getCafe24EventType(eventNo: number): EventType {
  return CAFE24_EVENT_NO_MAP[eventNo];
}

/**
 * cafe24 이벤트 본문에서 event_no를 검증하고 적절한 이벤트 타입을 반환하는 함수
 * @param event API Gateway 이벤트
 * @returns 이벤트 타입 또는 null
 */
function validateCafe24Event(event: APIGatewayProxyEvent): EventType | null {
  if (!event.body) {
    console.error("cafe24 이벤트 파싱 오류: 요청 본문이 없습니다.");
    return null;
  }

  try {
    const body = JSON.parse(event.body);
    if (!body.event_no) {
      console.error("cafe24 이벤트 파싱 오류: event_no가 누락되었습니다.");
      return null;
    }

    return getCafe24EventType(body.event_no);
  } catch (error) {
    console.error("cafe24 이벤트 파싱 오류:", error);
    return null;
  }
}

/**
 * shopby 또는 기본 이벤트 타입을 파싱하는 함수
 * @param eventType 이벤트 타입 문자열
 * @returns 파싱된 이벤트 타입 또는 null
 */
function parseShopbyEventType(eventType: string | undefined): EventType | null {
  if (!eventType) {
    return null;
  }

  return Object.values(EVENT_TYPES).includes(eventType as EventType)
    ? (eventType as EventType)
    : null;
}

/**
 * API Gateway 이벤트에서 이벤트 타입을 파싱하는 함수
 * @param event API Gateway 이벤트
 * @returns 이벤트 타입 또는 null (이벤트 타입이 없는 경우)
 */
export function parseEventType(event: APIGatewayProxyEvent): EventType | null {
  const queryParams = event.queryStringParameters || {};
  const shopType = queryParams.shopType;

  if (shopType === "cafe24") {
    return validateCafe24Event(event);
  }

  return parseShopbyEventType(queryParams.eventType);
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
