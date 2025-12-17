import type { Product } from "./index";

export interface Cart {
  products: Product[];
  total: ComputedRef<number>;
  subtotal: ComputedRef<number>;
  shipping: {
    costo: number;
    limite: number;
    isFree: ComputedRef<boolean>;
  };
}
