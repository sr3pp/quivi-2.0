import { Product } from "~/types";
import { Product as ProductModel, ProductBrand } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { brand } = getQuery(event);

  const Brand = await ProductBrand.findOne({
    name: brand,
  });

  const products = await ProductModel.find({
    priority: 99,
    brand: Brand._id,
  }).limit(6);

  return products;
});
