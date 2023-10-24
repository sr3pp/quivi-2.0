import { Product } from "../Models";
import { getStartIndex } from "./getStartIndex";

export const searchHandler = async (
  search: string,
  page: number,
  limit: number,
  perPage: number,
) => {
  const startIndex = getStartIndex(page, limit);
  const endIndex = startIndex + limit - 1;

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { sae: { $regex: search, $options: "i" } },
    ],
  };

  const products = await Product.find(query)
    .populate(["brand", "category", "subcategory"])
    .skip((page - 1) * perPage)
    .limit(perPage);

  const total = await Product.countDocuments(query);

  const pagination = {
    limit,
    startIndex,
    endIndex,
    page,
    pages: Math.ceil(Number(total) / limit),
  };
  return {
    products,
    pagination,
  };
};
