import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const filters = await readBody<Product>(event);
  const products: Product[] = await ProductModel.find({
    name: { $regex: filters.name, $options: "i" },
  });

  return products;
});
