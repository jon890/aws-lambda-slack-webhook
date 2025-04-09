// 주문 이벤트 관련 타입 정의
export type OrderEventData = {
  eventType: string;
  order: {
    orderNo: string;
    mallNo: number;
    serviceNo: number;
    memberNo: number;
    memberYn: "Y" | "N";
    ordererName: string;
    ordererContact1: string;
    ordererContact2: string;
    ordererEmail: string;
    payType: string;
    pgType: string;
    platformType: string;
    lastPayAmt: number;
    lastSubPayAmt: number;
    lastStandardAmt: number;
    lastDeliveryAmt: number;
    lastRemoteDeliveryAmt: number;
    lastImmediateDiscountAmt: number;
    lastAdditionalDiscountAmt: number;
    lastCartCouponDiscountAmt: number;
    lastProductCouponDiscountAmt: number;
    lastTaxFreeAmt: number;
    lastTaxableAmt: number;
    lastVatAmt: number;
    firstSalesTaxAmt: number;
    lastSalesTaxAmt: number;
    firstCustomsDutyAmt: number;
    lastCustomsDutyAmt: number;
    registerYmdt: string;
    trackingKey: string;
    cartCouponIssueNo: number;
    channelType: string | null;
    orderProducts: OrderProduct[];
  };
  pay: {
    pgType: string;
    payType: string;
    payYmdt: string;
    payStatusType: string;
    payInfo: {
      payType: string;
      cardInfo: {
        cardCompany: string;
        cardCode: string;
        cardName: string;
        approveYmdt: string;
        cardNo: string;
        cardApprovalNumber: string;
        noInterest: boolean;
        installmentPeriod: number;
        cardAmt: number;
      };
      bankInfo: {
        bank: string;
        bankCode: string;
        bankName: string;
        account: string;
        bankAmt: number;
        depositAmt: number;
        depositYmdt: string;
        remitterName: string;
        depositorName: string;
        paymentExpirationYmdt: string;
      };
      cashAuthNo: string;
      cashNo: string;
      tradeNo: string;
      escrowYn: string;
      payAmt: number;
      sellerCouponAmt: number;
      pgCouponAmt: number;
      cardCouponAmt: number;
      pointAmt: number;
      paymentKey: {
        pgType: string;
        key: string;
        etcInfos: Record<string, any>;
      };
      taxType: string;
      mobileInfo: {
        mobileNo: string;
        mobileCompany: string;
      };
      naverPayInfo: {
        paymentMeans: string;
        paymentDueDate: string;
        paymentNumber: string;
        orderDiscountAmount: number;
        generalPaymentAmount: number;
        naverMileagePaymentAmount: number;
        chargeAmountPaymentAmount: number;
        checkoutAccumulationPaymentAmount: number;
        orderType: string;
        payLocationType: string;
        paymentCoreType: string;
        payLaterPaymentAmount: number;
      };
    };
  };
};

// 주문 상태 변경 이벤트 타입
export type OrderStatusChangeData = {
  eventType: string;
  orderProductOptionNo: number;
  orderNo: string;
  memberNo: number;
  userInputs?: {
    inputLabel: string;
    inputValue: string;
  }[];
  serviceNo: number;
  mallNo: number;
  deliveryNo: number;
  deliveryTemplateNo: number;
  deliveryInternationalYn: boolean;
  mallProductNo: number;
  productName: string;
  mallOptionNo: number;
  mallAdditionalProductNo: number;
  optionUseYn: string;
  optionName: string;
  optionValue: string;
  imageUrl: string;
  orderCnt: number;
  originalOrderCnt: number;
  salePrice: number;
  immediateDiscountAmt: number;
  addPrice: number;
  additionalDiscountAmt: number;
  partnerChargeAmt: number;
  adjustedAmt: number;
  orderStatusType: string;
  claimStatusType: string | null;
  orderYmdt: string;
  payYmdt: string;
  orderAcceptYmdt: string | null;
  releaseReadyYmdt: string | null;
  releaseYmdt: string | null;
  deliveryCompleteYmdt: string | null;
  buyConfirmYmdt: string | null;
  registerYmdt: string;
  trackingKey: string;
  deliveryCompanyType: string;
  invoiceNo: string | null;
  receiverName: string;
  zipCd: number;
  address: string;
  detailAddress: string;
  jibunAddress: string;
  receiverCity: string;
  receiverState: string;
  contact1: string;
  contact2: string;
  productManagementCd: string;
  optionManagementCd: string;
  usesShippingInfoLaterInput: boolean;
  shippingInfoLaterInputContact: string | null;
  encryptedShippingNo: string | null;
  retrieveInvoiceUrl: string | null;
  isFreeGift: boolean;
  updateAdminNo: number;
  extraManagementCd: string;
  order: {
    extraData: string;
    currencyCode: string;
    exchangeRate: number | null;
  };
  claimNo: number;
  requestChannelType: string;
  channelType: string | null;
};

// 주문 상품 타입
export type OrderProduct = {
  orderProductNo: number;
  mallProductNo: number;
  productName: string;
  productManagementCd: string;
  hsCode: string;
  eanCode: string | null;
  partnerNo: number;
  lastProductCouponDiscountAmt: number;
  productCouponIssueNo: number;
  orderProductOptions: OrderProductOption[];
};

// 주문 상품 옵션 타입
export type OrderProductOption = {
  orderProductOptionNo: number;
  orderNo: string;
  memberNo: number;
  userInputs?: {
    inputLabel: string;
    inputValue: string;
  }[];
  serviceNo: number;
  mallNo: number;
  mallProductNo: number;
  productName: string;
  mallOptionNo: number;
  mallAdditionalProductNo: number;
  optionUseYn: string;
  optionName: string;
  optionValue: string;
  imageUrl: string;
  orderCnt: number;
  originalOrderCnt: number;
  salePrice: number;
  immediateDiscountAmt: number;
  addPrice: number;
  additionalDiscountAmt: number;
  partnerChargeAmt: number;
  adjustedAmt: number;
  orderStatusType: string;
  claimStatusType: string | null;
  orderYmdt: string;
  payYmdt: string;
  orderAcceptYmdt: string | null;
  releaseReadyYmdt: string | null;
  releaseYmdt: string | null;
  deliveryCompleteYmdt: string | null;
  buyConfirmYmdt: string | null;
  registerYmdt: string;
  trackingKey: string;
  deliveryNo: number;
  deliveryInternationalYn: boolean;
  optionManagementCd: string;
  deliveryTemplateNo: number;
  deliveryCompanyType: string;
  invoiceNo: string | null;
  receiverName: string;
  receiverContact1: string;
  receiverContact2: string;
  zipCd: number;
  receiverAddress: string;
  receiverDetailAddress: string;
  receiverJibunAddress: string;
  usesShippingInfoLaterInput: boolean;
  shippingInfoLaterInputContact: string | null;
  encryptedShippingNo: string | null;
  shippingEmptyAutoCancelYmdt: string;
  customsIdNumber: string;
};

// Slack 메시지 포맷
export type SlackMessage = {
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
};

export type SlackBlock = {
  type: "section" | "divider" | "header" | "context";
  text?: {
    type: "plain_text" | "mrkdwn";
    text: string;
    emoji?: boolean;
  };
  fields?: {
    type: "plain_text" | "mrkdwn";
    text: string;
  }[];
  // 기타 블록 속성
};

export type SlackAttachment = {
  color?: string;
  pretext?: string;
  title?: string;
  title_link?: string;
  text?: string;
  fields?: {
    title: string;
    value: string;
    short?: boolean;
  }[];
  // 기타 어태치먼트 속성
};

// Lambda 함수 응답 타입
export type LambdaResponse = {
  statusCode: number;
  body: any;
  headers?: Record<string, string>;
};
