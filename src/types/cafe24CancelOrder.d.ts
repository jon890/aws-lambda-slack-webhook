import {
  Cafe24AmountString,
  Cafe24Boolean,
  Cafe24DateString,
  Cafe24OrderPlaceName,
} from "./cafe24";

/**
 * Cafe24 주문 취소 이벤트 데이터 타입 (event_no: 90026)
 */
export type Cafe24CancelOrderData = {
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
    cancel_date: Cafe24DateString | null;
    shipping_fee: Cafe24AmountString;
    shipping_type: string;
    shipping_status: string;
    wished_delivery_date: string;
    wished_delivery_time: string | null;
    store_pickup: Cafe24Boolean;
    shipping_message: string;
    order_place_id: string;
    ordering_product_code: string;
    ordering_product_name: string;
  };
};
