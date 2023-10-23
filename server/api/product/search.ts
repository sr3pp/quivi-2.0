import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { search } = await readBody(event);
  const products = await ProductModel.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { sae: { $regex: search, $options: "i" } },
    ],
  })
    .populate(["brand", "category", "subcategory"])
    .limit(10);

  return products.map((product: any) => ({
    ...product._doc,
    url: `/producto/${product.web}`,
  }));
});
