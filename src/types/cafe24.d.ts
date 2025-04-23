// Cafe24 상품 이벤트 데이터 타입
export type Cafe24ProductEventData = {
  event_no: number;
  resource: {
    mall_id: string;
    event_shop_no: string;
    product_no: number;
    product_code: string;
    created_date: string;
    updated_date: string;
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
    retail_price: string;
    supply_price: string;
    price: string;
    price_content: string | null;
    adult_certification: string;
    manufacturer_code: string;
    supplier_code: string;
    brand_code: string;
    trend_code: string;
    made_date: string;
    release_date: string;
    origin_place_code: number;
    shipping_scope: string;
    translated: string;
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
    order_date: string;
    order_place_name: string;
    member_id: string | null;
    member_authentication: any;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_cellphone: string;
    group_no_when_ordering: string;
    first_order: boolean | null;
    order_from_mobile: string;
    paid: string;
    payment_date: string;
    billing_name: string;
    bank_code: string | null;
    payment_method: string;
    easypay_name: string;
    use_escrow: string;
    bank_account_no: string;
    order_price_amount: string;
    membership_discount_amount: string;
    actual_payment_amount: string;
    mileage_spent_amount: string;
    shipping_fee: string;
    shipping_type: string;
    shipping_status: string;
    wished_delivery_date: string;
    wished_delivery_time: string | null;
    store_pickup: string;
    shipping_message: string;
    order_place_id: string;
    ordering_product_code: string;
    ordering_product_name: string;
  };
};
