import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { brand } = getQuery(event);

  const products = await ProductModel.find({
    priority: 99,
    brand,
  }).limit(6);

  return products;
});
