import type { Cafe24OrderEventData } from "../types/cafe24";
import type { EventParser } from "../types/parser";
import type { SlackMessage } from "../types/slack";
import {
  formatDateString,
  formatPrice,
  parseCafe24PaymentMethod,
} from "./formatUtils";

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
      member_id,
      first_order,
    } = resource;

    const paymentStatus = paid === "T" ? "결제완료" : "미결제";
    const memberStatus = member_id ? "회원" : "비회원";
    const isFirstOrder = first_order === "T" ? "예" : "아니오";

    const productNames = ordering_product_name.split(",");
    const productCodes = ordering_product_code.split(",");
    const productTexts: string[] = productNames.map((name, idx) => {
      const code = productCodes[idx] || "";
      return `${name.trim()}${code ? ` (${code.trim()})` : ""}`;
    });
    const productText = productTexts.join("\n");

    const paymentMethodText = parseCafe24PaymentMethod(payment_method);

    const orderDate = formatDateString(order_date);
    const paymentDateFormatted = payment_date
      ? formatDateString(payment_date)
      : "미결제";

    const messageText = `:tada: *[CAFE24] ${buyer_name}님이 구매하셨습니다.* :tada:
*주문번호:* ${order_id}
*주문상품:* ${productText}
*결제수단:* ${paymentMethodText}
*실결제금액:* ${formatPrice(actual_payment_amount)} 원
*이메일:* ${buyer_email}
*연락처:* ${buyer_cellphone}
*회원상태:*
  - 회원여부: ${memberStatus}${member_id ? `\n  - 회원ID: ${member_id}` : ""}
  - 첫주문: ${isFirstOrder}

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

export const cafe24OrderParser = new Cafe24OrderParser();
