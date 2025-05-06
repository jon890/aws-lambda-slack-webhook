// Cafe24에서 Boolean 값을 표현하는 타입
export type Cafe24Boolean = "T" | "F";

// Cafe24 날짜 문자열 타입 (ISO 8601 형식: 2020-07-17T15:28:14+09:00)
export type Cafe24DateString = string;

// Cafe24 금액 문자열 타입 (숫자로 파싱 가능한 문자열: "1000", "1500.50")
export type Cafe24AmountString = string;

// Cafe24 주문 경로 타입
export type Cafe24OrderPlaceName =
  | "PC"
  | "MOBILE_WEB"
  | "MOBILE_APP"
  | "SYNDICATION"
  | string;

// Cafe24 배송 상태 타입
export type Cafe24ShippingStatus =
  | "SHIPPING_READY"
  | "DELIVERING"
  | "SHIPPED_COMPLETE"
  | "CANCELED"
  | string;

// Cafe24 상품 이벤트 데이터 타입
export type Cafe24ProductEventData = {
  event_no: number;
  resource: {
    mall_id: string;
    event_shop_no: string;
    product_no: number;
    product_code: string;
    created_date: Cafe24DateString;
    updated_date: Cafe24DateString;
    product_name: string;
    eng_product_name: string;
    supply_product_name: string;
    model_name: string;
    custom_product_code: string;
    product_condition: string;
    summary_description: string;
    simple_description: string;
    description: string;
    display: string;
    selling: string;
    retail_price: Cafe24AmountString;
    supply_price: Cafe24AmountString;
    price: Cafe24AmountString;
    price_content: string | null;
    adult_certification: Cafe24Boolean;
    manufacturer_code: string;
    supplier_code: string;
    brand_code: string;
    trend_code: string;
    made_date: Cafe24DateString;
    release_date: Cafe24DateString;
    origin_place_code: number;
    shipping_scope: string;
    translated: Cafe24Boolean;
  };
};

// Cafe24 이벤트 공통 타입
export type Cafe24EventBase = {
  event_no: number;
  resource: Record<string, any>;
};

// Cafe24 주문 이벤트 데이터 타입
export type Cafe24OrderEventData = {
  event_no: number;
  resource: {
    mall_id: string;
    event_shop_no: string;
    event_code: string;
    order_id: string;
    payment_gateway_name: string;
    currency: string;
    order_date: Cafe24DateString;
    order_place_name: Cafe24OrderPlaceName;
    member_id: string | null;
    member_authentication: any;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_cellphone: string;
    group_no_when_ordering: string;
    first_order: Cafe24Boolean;
    order_from_mobile: Cafe24Boolean;
    paid: Cafe24Boolean;
    payment_date: Cafe24DateString;
    billing_name: string;
    bank_code: string | null;
    payment_method: string;
    easypay_name: string;
    use_escrow: Cafe24Boolean;
    bank_account_no: string;
    order_price_amount: Cafe24AmountString;
    membership_discount_amount: Cafe24AmountString;
    actual_payment_amount: Cafe24AmountString;
    mileage_spent_amount: Cafe24AmountString;
    shipping_fee: Cafe24AmountString;
    shipping_type: string;
    shipping_status: Cafe24ShippingStatus;
    wished_delivery_date: Cafe24DateString;
    wished_delivery_time: string | null;
    store_pickup: Cafe24Boolean;
    shipping_message: string;
    order_place_id: string;
    ordering_product_code: string;
    ordering_product_name: string;
  };
};
