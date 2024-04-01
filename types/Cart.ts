import type { Product } from "./index";

export interface Cart {
  products: Product[];
  total: number;
}
