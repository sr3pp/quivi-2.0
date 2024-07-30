import { Product } from "~/server/Models";
import type { Product as ProductType } from "~/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const product: ProductType = await Product.create(body);
    return product;
  } catch (error) {
    setResponseStatus(event, 500);
    return error;
  }
});
