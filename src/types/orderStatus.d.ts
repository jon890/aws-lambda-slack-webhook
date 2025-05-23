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
