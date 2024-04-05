import { ProductBrand } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const productBrands = await ProductBrand.find().sort({ name: 1 });

  return productBrands;
});
