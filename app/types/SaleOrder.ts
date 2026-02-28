import type { BillData } from "./BillData";
import type { ShipmentData } from "./ShipmentData";

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
  shipment: ShipmentData;
  bill?: BillData | null;
  [key: string]: unknown;
}
