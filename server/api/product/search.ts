import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";

const getStartIndex = (page: number, limit: number) => {
  return Math.floor((page - 1) * (limit / 100)) * 10;
};

export default defineEventHandler(async (event) => {
  const { page = 1, limit = 10, perPage = 16 }: any = getQuery(event);

  const startIndex = getStartIndex(page, limit);
  const endIndex = startIndex + limit - 1;

  const { search } = await readBody(event);

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { sae: { $regex: search, $options: "i" } },
    ],
  };

  const products = await ProductModel.find(query)
    .populate(["brand", "category", "subcategory"])
    .skip((page - 1) * perPage)
    .limit(perPage);

  const total = await ProductModel.countDocuments(query);

  const pagination = {
    limit,
    startIndex,
    endIndex,
    page,
    pages: Math.ceil(total / limit),
  };
  return {
    products: products.map((product: any) => ({
      ...product._doc,
      url: `/producto/${product.web}`,
    })),
    pagination,
  };
});
