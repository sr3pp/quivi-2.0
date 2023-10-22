import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async () => {
  const products: Product[] = await ProductModel.find();
  return products;
});
