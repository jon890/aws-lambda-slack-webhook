import type { OrderStatusChangeData } from "../types/orderStatus";
import type { SlackMessage } from "../types/slack";
import type { EventParser } from "../types/parser";
import { formatAmount } from "./formatUtils";

/**
 * 주문 상태 변경 데이터를 Slack 메시지로 변환하는 파서
 */
export class OrderStatusChangeParser
  implements EventParser<OrderStatusChangeData>
{
  /**
   * 주문 상태 변경 데이터를 Slack 메시지로 변환
   * @param data 주문 상태 변경 데이터
   * @returns Slack 메시지 형식
   */
  parse(data: OrderStatusChangeData): SlackMessage {
    // 필요한 데이터 추출
    const {
      orderNo,
      productName,
      orderStatusType,
      receiverName,
      invoiceNo,
      deliveryCompanyType,
      adjustedAmt,
      optionName,
      optionValue,
      orderCnt,
      userInputs,
    } = data;

    // 주문 상태 텍스트 (한글로 변환)
    const orderStatusMap: Record<string, string> = {
      DEPOSIT_WAIT: `:hourglass: *[웹] ${receiverName}님의 입금을 기다리고 있습니다.* :hourglass:`,
      PAY_DONE: `:white_check_mark: *[웹] ${receiverName}님의 결제가 완료되었습니다.* :white_check_mark:`,
      PRODUCT_PREPARE: `:package: *[웹] ${receiverName}님의 상품을 준비중입니다.* :package:`,
      DELIVERY_PREPARE: `:inbox_tray: *[웹] ${receiverName}님의 배송을 준비중입니다.* :inbox_tray:`,
      DELIVERY_ING: `:truck: *[웹] ${receiverName}님의 상품이 배송중입니다.* :truck:`,
      DELIVERY_DONE: `:mailbox_with_mail: *[웹] ${receiverName}님의 상품이 배달완료되었습니다.* :mailbox_with_mail:`,
      BUY_CONFIRM: `:sparkles: *[웹] ${receiverName}님이 주문을 확정하셨습니다.* :sparkles:`,
      CANCEL_DONE: `:sweat_drops: *[웹] ${receiverName}님이 주문을 취소하였습니다.* :sweat_drops:`,
    };

    const orderStatusText = orderStatusMap[orderStatusType] || orderStatusType;

    // 배송 회사 텍스트 (한글로 변환)
    const deliveryCompanyMap: Record<string, string> = {
      CJ: "CJ대한통운",
      LOTTE: "롯데택배",
      HANJIN: "한진택배",
      POST: "우체국택배",
      LOGEN: "로젠택배",
      KGB: "KGB택배",
      KYOUNG_DONG: "경동택배",
      DAESIN: "대신택배",
      ILYANG: "일양로지스",
      CHUNIL: "천일택배",
      CVSNET: "편의점택배",
      DONG_BU: "동부택배",
      AIRLIFT: "에어리프트",
      QUICK_START: "퀵스타트",
      DAILY_EXPRESS: "일반택배",
      HOMEPICK: "홈픽택배",
      HDEXP: "합동택배",
      SUPREME_EXPRESS: "서프림익스프레스",
      FRESH_SOLUTION: "프레시솔루션",
    };

    const deliveryCompanyText =
      deliveryCompanyMap[deliveryCompanyType] || deliveryCompanyType;

    // 송장번호 텍스트
    const invoiceText = invoiceNo
      ? `${deliveryCompanyText} ${invoiceNo}`
      : "송장번호 미등록";

    // 상품 정보 텍스트 구성
    let productText = `${productName} ${orderCnt || 1}개`;

    // 옵션 정보가 있는 경우 추가
    if (optionName && optionValue) {
      productText += ` (${optionName}: ${optionValue})`;
    }

    // 사용자 입력형 옵션 정보 추가
    if (userInputs && userInputs.length > 0) {
      const userInputTexts = userInputs
        .map((input) => `${input.inputLabel}: ${input.inputValue}`)
        .join(", ");
      productText += ` [${userInputTexts}]`;
    }

    // 가격 정보 추가
    productText += ` - ${formatAmount(adjustedAmt)}원`;

    // 슬랙 메시지 생성 (텍스트 강조 및 이모티콘 적용)
    const messageText = `${orderStatusText}
*주문번호:* ${orderNo}
*주문상품:* ${productText}
*수령인:* ${receiverName}
*송장정보:* ${invoiceText}`;

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
export const orderStatusChangeParser = new OrderStatusChangeParser();
