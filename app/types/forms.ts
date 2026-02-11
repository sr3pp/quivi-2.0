export interface ObjectIdRef {
  _id: string;
}

export interface ProductFormProduct {
  _id?: string;
  sae?: string;
  web?: string;
  name?: string;
  description?: string;
  price?: number;
  priority?: number;
  discount?: number;
  extra?: string | null;
  meassure_unity?: string;
  line?: string | null;
  brand?: string | ObjectIdRef;
  category?: string | ObjectIdRef;
  subcategory?: string | ObjectIdRef;
  years?: number[];
  car_brands?: string[];
  models?: string[];
  thumbs?: string[];
}

export interface ProductFormSubmitData extends ProductFormProduct {
  years: number[];
  car_brands: string[];
  models: string[];
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
