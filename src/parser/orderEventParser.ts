import type { OrderEventData } from "../types/order";
import type { SlackMessage } from "../types/slack";
import type { EventParser } from "../types/parser";
import {
  formatAmount,
  getPlatformTypeText,
  getPaymentMethodText,
} from "./formatUtils";

/**
 * 주문 이벤트 데이터를 Slack 메시지로 변환하는 파서
 */
export class OrderEventParser implements EventParser<OrderEventData> {
  /**
   * 주문 이벤트 데이터를 Slack 메시지로 변환
   * @param data 주문 이벤트 데이터
   * @returns Slack 메시지 형식
   */
  parse(data: OrderEventData): SlackMessage {
    // 필요한 데이터 추출
    const { order, pay } = data;
    const { ordererName, orderNo, memberYn, platformType, ordererEmail } =
      order;
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
          userInputs:
            userInputTexts.length > 0 ? userInputTexts.join(", ") : "",
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
}

// 싱글톤 인스턴스 생성 및 내보내기
export const orderEventParser = new OrderEventParser();
