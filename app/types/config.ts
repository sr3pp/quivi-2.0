export interface ShippingConfig {
  limite: number;
  costo: number;
  clave?: string;
}

export interface ShippingPayload {
  limite?: string | number;
  costo?: string | number;
  clave?: string;
}

export type EstadosMap = Record<string, string[]>;

export interface ConfigEntry<T = Record<string, unknown>> {
  stem: string;
  meta: T;
  [key: string]: unknown;
}
