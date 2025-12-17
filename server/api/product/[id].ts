import { Product as ProductModel } from "../../Models";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const { id } = params;

  const product = await ProductModel.findById(id).populate([
    "brand",
    "category",
    "subcategory",
    "car_brands",
    "models",
    "motors",
    "segment",
  ]);

  return product;
});
