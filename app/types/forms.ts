import type { Product } from "./product";

export interface ObjectIdRef {
  _id: string;
}

export interface ProductFormProduct extends Partial<Product> {
  _id?: string;
  brand?: string | ObjectIdRef;
  category?: string | ObjectIdRef;
  subcategory?: string | ObjectIdRef;
  years?: number[];
  car_brands?: string[];
  models?: string[];
  thumbs?: string[];
}

export interface ProductFormSubmitData
  extends Record<string, unknown>,
    ProductFormProduct {
  yearsItems: Array<{ value: number; name: string }>;
  carBrandsItems: Array<{ value: string; name: string }>;
  modelsItems: Array<{ value: string; name: string }>;
}

export interface SatOption {
  value: string;
  label?: string;
  name?: string;
}

export interface SatConfig {
  usos: SatOption[];
  regimenes: SatOption[];
}

export interface EstadoConfig {
  name: string;
  municipios: string[];
}
