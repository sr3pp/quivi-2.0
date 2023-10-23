import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const products = await ProductModel.find().limit(10);
  return products;
});
