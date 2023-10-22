import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const products: Product[] = [];
  const files = (await readMultipartFormData(event)) as any[];
  const file = files[0];
  console.log(file);

  // const _products = await ProductModel.updateMany({}, products, {
  //   upsert: true,
  // });
  //return _products;

  return true;
});
