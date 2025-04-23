import type { Cafe24OrderEventData } from "../types/cafe24";
import type { SlackMessage } from "../types/slack";
import { formatPrice } from "./formatUtils";

/**
 * Cafe24 주문 이벤트 데이터를 슬랙 메시지로 변환하는 함수
 * @param data Cafe24 주문 이벤트 데이터
 * @returns 슬랙 메시지 형식
 */
export function parseCafe24Order(data: Cafe24OrderEventData): SlackMessage {
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

  // 상품 정보 포맷팅
  const productNames = ordering_product_name.split(",");
  const productCodes = ordering_product_code.split(",");

  const productList = productNames
    .map((name, index) => {
      const code = productCodes[index] || "";
      return `- ${name} (${code})`;
    })
    .join("\n");

  // 주문일시 포맷팅
  const orderDate = new Date(order_date).toLocaleString("ko-KR");
  const paymentDateFormatted = payment_date
    ? new Date(payment_date).toLocaleString("ko-KR")
    : "미결제";

  // 슬랙 메시지 생성
  const messageText = `:shopping_bags: *Cafe24 주문이 생성되었습니다* :shopping_bags:
*쇼핑몰:* ${mall_id}
*주문번호:* ${order_id}
*주문자:* ${buyer_name}
*이메일:* ${buyer_email}
*연락처:* ${buyer_cellphone}
*주문일시:* ${orderDate}
*결제일시:* ${paymentDateFormatted}
*결제상태:* ${paymentStatus}
*결제방법:* ${payment_method}
*주문금액:* ${formatPrice(order_price_amount)}원
*실결제금액:* ${formatPrice(actual_payment_amount)}원
*배송비:* ${formatPrice(shipping_fee)}원
*주문경로:* ${order_place_name}

*주문상품:*
${productList}`;

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
