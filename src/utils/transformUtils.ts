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
    case "ACCOUNT":
      return "무통장 입금";
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
  const { ordererName, orderNo, memberYn, platformType, ordererEmail } = order;
  const { payType } = pay;
  const lastPayAmt = order.lastPayAmt;

  // 플랫폼 타입 (웹/앱)
  const platformTypeText = getPlatformTypeText(platformType);

  // 주문 상품 및 옵션 정보 생성
  const productDetails = order.orderProducts.map((product) => {
    const options = product.orderProductOptions.map((option) => {
      // 옵션 정보 텍스트 구성
      let optionInfo = "";
      if (
        option.optionUseYn === "Y" &&
        option.optionName &&
        option.optionValue
      ) {
        optionInfo = `${option.optionName}: ${option.optionValue}`;
      }

      // 사용자 입력형 옵션 정보 추가
      const userInputTexts: string[] = [];
      if (option.userInputs && option.userInputs.length > 0) {
        option.userInputs.forEach((input) => {
          userInputTexts.push(`${input.inputLabel}: ${input.inputValue}`);
        });
      }

      return {
        name: product.productName,
        count: option.orderCnt,
        optionInfo,
        userInputs: userInputTexts.length > 0 ? userInputTexts.join(", ") : "",
        price: option.adjustedAmt,
      };
    });

    return {
      name: product.productName,
      options,
    };
  });

  // 상품과 옵션 정보를 텍스트로 변환
  const productTexts: string[] = [];

  productDetails.forEach((product) => {
    product.options.forEach((option) => {
      let productText = `${product.name} ${option.count}개`;

      // 옵션 정보가 있는 경우 추가
      if (option.optionInfo) {
        productText += ` (${option.optionInfo})`;
      }

      // 사용자 입력형 옵션 정보가 있는 경우 추가
      if (option.userInputs) {
        productText += ` [${option.userInputs}]`;
      }

      // 가격 정보 추가
      productText += ` - ${formatAmount(option.price)}원`;

      productTexts.push(productText);
    });
  });

  const productText = productTexts.join("\n");

  // 결제 수단 텍스트
  const paymentMethodText = getPaymentMethodText(payType);

  // 슬랙 메시지 생성 (텍스트 강조 및 이모티콘 적용)
  const messageText = `:tada: *[${platformTypeText}] ${ordererName}님이 구매하셨습니다.* :tada:
*주문번호:* ${orderNo}
*주문상품:* ${productText}
*결제수단:* ${paymentMethodText}
*실결제금액:* ${formatAmount(lastPayAmt)} 원
*회원상태:*
  - 회원: ${memberYn === "Y" ? "예" : "아니오"}
  - 이메일: ${ordererEmail}`;

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
