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
