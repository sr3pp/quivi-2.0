import type { BillData } from "./BillData";
import type { Product } from "./product";
import type { ShippmentData } from "./ShippmentData";

export type PaymentMethodKey =
  | "credit-card"
  | "debit-card"
  | "paypal"
  | "spei"
  | "cash";

export type PaymentCode = "TRC" | "TRD" | "PYP" | "TRN" | "EFE";

export interface PaymentOption {
  name: string;
  value: PaymentMethodKey | "";
}

export interface CheckoutStep {
  label: string;
  enabled: boolean;
  active: boolean;
  done: boolean;
}

export interface OpenpayPaymentMethod {
  type?: string;
  url?: string;
  url_spei?: string;
  reference?: string;
}

export interface OpenpayChargeResponse {
  id: string;
  status: string;
  payment_method: OpenpayPaymentMethod;
}

export interface OpenpayVerificationResponse {
  status: string;
  payment_method: OpenpayPaymentMethod;
  reference?: string;
  barcode_url?: string;
}

export interface PaypalLink {
  href: string;
  rel?: string;
  method?: string;
}

export interface PaypalCreateOrderResponse {
  links: PaypalLink[];
}

export interface OrderLineItem {
  product: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface SaleOrderDraft {
  user: null | Record<string, never>;
  products: OrderLineItem[];
  order_no: string;
  sae_order: string | null;
  status: boolean;
  shipping: ShippmentData;
  payment: {
    method: PaymentCode | "";
    transaction: string;
    status: boolean;
    installments: number;
  };
  discount: number;
  total: number;
  billing?: BillData;
}

export interface OpenpayPayInput {
  paymentMethod: PaymentOption;
  total: number;
  shippmentData: ShippmentData;
  paymentPlan?: number;
}

export type CheckoutCartProduct = Product & {
  qty: number;
};
