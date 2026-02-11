import type { BillData } from "./BillData";
import type { ShippmentData } from "./ShippmentData";

export interface SaleOrder {
  _id?: string;
  order_no?: string;
  sae_order?: string;
  products?: Array<unknown>;
  payment: {
    transaction?: string | null;
    method: string;
    status?: boolean;
    installments?: number;
  };
  shipment: ShippmentData;
  bill?: BillData | null;
  [key: string]: unknown;
}
