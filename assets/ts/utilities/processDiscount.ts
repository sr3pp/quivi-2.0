import { Product } from "~/types";
import { toPrice } from "./toPrice";

export const processDiscount = (product: Product) => {
  const _price = product.price as number;
  const _discount = product.discount ? (product.discount as number) : 0;
  const price = _price - _price * (_discount / 100);

  return toPrice(price as number);
};
