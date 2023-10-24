import { Product } from "~/server/Models";
import { getStartIndex, searchHandler } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { search, page = 1, limit = 10, perPage = 16 }: any = getQuery(event);

  const startIndex = getStartIndex(page, limit);
  const endIndex = startIndex + limit - 1;

  if (search) return searchHandler(search, page, limit, perPage);

  const products = await Product.find()
    .skip((page - 1) * perPage)
    .limit(perPage);
  const total = await Product.countDocuments();

  const pagination = {
    limit,
    startIndex,
    endIndex,
    page,
    pages: Math.ceil(total / limit),
  };
  return {
    products,
    pagination,
  };
});
