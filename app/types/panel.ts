export interface PanelProductRow {
  _id: string;
  sae: string;
  web: string;
  name: string;
  [key: string]: any;
}

export interface PanelShippingRow {
  order?: string;
  name?: string;
  last_name?: string;
  createdAt?: string;
  status?: string;
  [key: string]: any;
}

export interface PanelSaleRow {
  _id?: string;
  order_no?: string;
  sae_order?: string;
  products?: Array<any>;
  total?: number;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}
