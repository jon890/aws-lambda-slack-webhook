import type { Cafe24CancelOrderData } from "../types/cafe24CancelOrder";
import type { EventParser } from "../types/parser";
import type { SlackMessage } from "../types/slack";
import {
  formatDateString,
  formatPrice,
  parseCafe24PaymentMethod,
} from "./formatUtils";

/**
 * Cafe24 주문 취소 이벤트(event_no: 90026)를 Slack 메시지로 변환하는 파서
 */
export class Cafe24CancelOrderParser
  implements EventParser<Cafe24CancelOrderData>
{
  /**
   * Cafe24 주문 취소 이벤트 데이터를 Slack 메시지로 변환
   * @param data Cafe24 주문 취소 이벤트 데이터
   * @returns Slack 메시지 형식
   */
  parse(data: Cafe24CancelOrderData): SlackMessage {
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
      cancel_date,
      event_code,
    } = resource;

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
    const cancelDateFormatted = cancel_date
      ? formatDateString(cancel_date)
      : "취소일자 정보 없음";

    const messageText = `:x: *[CAFE24] ${buyer_name}님의 주문이 취소되었습니다.* :x:
*주문번호:* ${order_id}
*취소상품:* ${productText}
*결제수단:* ${paymentMethodText}
*취소금액:* ${formatPrice(actual_payment_amount)} 원
*이메일:* ${buyer_email}
*연락처:* ${buyer_cellphone}
*회원상태:*
  - 회원여부: ${memberStatus}${member_id ? `\n  - 회원ID: ${member_id}` : ""}
  - 첫주문: ${isFirstOrder}

*추가정보:*
  - 주문일시: ${orderDate}
  - 결제일시: ${paymentDateFormatted}
  - 취소일시: ${cancelDateFormatted}
  - 취소코드: ${event_code}
  - 주문경로: ${order_place_name}
  - 원주문금액: ${formatPrice(order_price_amount)}원
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

export const cafe24CancelOrderParser = new Cafe24CancelOrderParser();
