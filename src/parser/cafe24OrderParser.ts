import type { Cafe24OrderEventData } from "../types/cafe24";
import type { SlackMessage } from "../types/slack";
import type { EventParser } from "../types/parser";
import { formatPrice } from "./formatUtils";

/**
 * Cafe24 주문 이벤트 데이터를 Slack 메시지로 변환하는 파서
 */
export class Cafe24OrderParser implements EventParser<Cafe24OrderEventData> {
  /**
   * Cafe24 주문 이벤트 데이터를 Slack 메시지로 변환
   * @param data Cafe24 주문 이벤트 데이터
   * @returns Slack 메시지 형식
   */
  parse(data: Cafe24OrderEventData): SlackMessage {
    // 필요한 데이터 추출
    const { event_no, resource } = data;
    const {
      mall_id,
      order_id,
      buyer_name,
      buyer_email,
      buyer_cellphone,
      order_date,
      payment_date,
      payment_method,
      order_price_amount,
      actual_payment_amount,
      order_place_name,
      ordering_product_name,
      ordering_product_code,
      paid,
      shipping_fee,
    } = resource;

    // 결제 상태 텍스트
    const paymentStatus = paid === "T" ? "결제완료" : "미결제";

    // 상품 정보 포맷팅 (orderEventParser와 유사하게)
    const productNames = ordering_product_name.split(",");
    const productCodes = ordering_product_code.split(",");
    const productTexts: string[] = productNames.map((name, idx) => {
      const code = productCodes[idx] || "";
      return `${name.trim()}${code ? ` (${code.trim()})` : ""}`;
    });
    const productText = productTexts.join("\n");

    const orderDate = order_date;
    const paymentDateFormatted = payment_date || "미결제";

    const messageText = `:tada: *[CAFE24] ${buyer_name}님이 구매하셨습니다.* :tada:
*주문번호:* ${order_id}
*주문상품:* ${productText}
*결제수단:* ${payment_method}
*실결제금액:* ${formatPrice(actual_payment_amount)} 원
*이메일:* ${buyer_email}
*연락처:* ${buyer_cellphone}

*추가정보:*
  - 쇼핑몰: ${mall_id}
  - 주문일시: ${orderDate}
  - 결제일시: ${paymentDateFormatted}
  - 결제상태: ${paymentStatus}
  - 주문경로: ${order_place_name}
  - 주문금액: ${formatPrice(order_price_amount)}원
  - 배송비: ${formatPrice(shipping_fee)}원
`;

    const slackMessage: SlackMessage = {
      text: messageText,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: messageText,
          },
        },
      ],
    };

    return slackMessage;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const cafe24OrderParser = new Cafe24OrderParser();
