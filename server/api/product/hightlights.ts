import { Product as ProductModel, ProductBrand } from "~~/server/Models";

export default defineEventHandler(async (event) => {
  const { codes } = await readBody(event);

  const products = await ProductModel.find({
    web: { $in: codes },
  });

  return products;
});
