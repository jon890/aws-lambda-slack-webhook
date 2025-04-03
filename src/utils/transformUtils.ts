import { OrderEventData, SlackMessage } from "../types";

/**
 * 주문 금액을 포맷팅하는 함수
 * @param amount 금액
 * @returns 포맷팅된 금액 문자열
 */
function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/**
 * 결제 수단을 한글로 변환하는 함수
 * @param payType 결제 유형
 * @returns 한글로 변환된 결제 수단
 */
function getPaymentMethodText(payType: string): string {
  switch (payType.toUpperCase()) {
    case "CREDIT_CARD":
      return "카드";
    case "BANK":
    case "VIRTUAL_ACCOUNT":
      return "무통장입금";
    case "NAVER_PAY":
      return "네이버페이";
    case "KAKAO_PAY":
      return "카카오페이";
    case "PAYCO":
      return "페이코";
    case "ACCUMULATION":
      return "적립금";
    default:
      return payType;
  }
}

/**
 * 플랫폼 타입을 변환하는 함수
 * @param platformType 플랫폼 타입
 * @returns 변환된 플랫폼 타입
 */
function getPlatformTypeText(platformType: string): string {
  switch (platformType.toUpperCase()) {
    case "PC":
    case "PC_WEB":
      return "웹";
    case "MOBILE_WEB":
      return "웹";
    case "MOBILE_APP":
      return "앱";
    default:
      return "웹";
  }
}

/**
 * 주문 이벤트 데이터를 슬랙 메시지로 변환하는 함수
 * @param data 주문 이벤트 데이터
 * @returns 슬랙 메시지 형식
 */
export function transformOrderEventToSlackMessage(
  data: OrderEventData
): SlackMessage {
  // 필요한 데이터 추출
  const { order, pay } = data;
  const { ordererName, orderNo, memberYn, platformType } = order;
  const { payType } = pay;
  const lastPayAmt = order.lastPayAmt;

  // 플랫폼 타입 (웹/앱)
  const platformTypeText = getPlatformTypeText(platformType);

  // 주문 상품 목록 생성
  const orderProducts = order.orderProducts.flatMap((product) =>
    product.orderProductOptions.map((option) => ({
      name: product.productName,
      count: option.orderCnt,
    }))
  );

  // 상품명과 개수를 텍스트로 변환
  const productCountMap = new Map<string, number>();

  orderProducts.forEach((product) => {
    const currentCount = productCountMap.get(product.name) || 0;
    productCountMap.set(product.name, currentCount + product.count);
  });

  const productTexts: string[] = [];
  productCountMap.forEach((count, name) => {
    productTexts.push(`${name} ${count}개`);
  });

  const productText = productTexts.join(", ");

  // 결제 수단 텍스트
  const paymentMethodText = getPaymentMethodText(payType);

  // 슬랙 메시지 생성 (텍스트 강조 및 이모티콘 적용)
  const messageText = `:tada: *[${platformTypeText}] ${ordererName}님이 구매하셨습니다.* :tada:
*주문번호:* ${orderNo}
*주문상품:* ${productText}
*결제수단:* ${paymentMethodText}
*실결제금액:* ${formatAmount(lastPayAmt)} 원
*비회원 구매:* ${memberYn === "Y" ? "아니오" : "예"}`;

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
