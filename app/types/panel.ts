export interface PanelProductRow {
  _id: string;
  sae: string;
  web: string;
  name: string;
  [key: string]: unknown;
}

export interface PanelShippingRow {
  order?: string;
  name?: string;
  last_name?: string;
  createdAt?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ShippingTracking {
  number?: string;
  store?: string;
  url?: string;
}

export interface ShippingSaleRef {
  _id?: string;
  sae_order?: string;
}

export interface PanelShippingDetail extends PanelShippingRow {
  sale: ShippingSaleRef[];
  tracking: ShippingTracking;
  email?: string;
  phone?: string;
  address?: Record<string, string>;
}

export interface PanelShippingListResponse {
  shipping: PanelShippingDetail[];
  pagination: Record<string, unknown>;
}

export interface PanelSaleRow {
  _id?: string;
  order_no?: string;
  sae_order?: string;
  products?: Array<unknown>;
  total?: number;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface PanelSalesModal {
  toggle: () => void;
}
