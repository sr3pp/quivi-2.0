import { Product } from "~/types";
import { Product as ProductModel, ProductBrand } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { brand } = getQuery(event);

  const products: Product[] = await ProductModel.find({
    brand: brand,
  }).limit(6);

  return products;
});
