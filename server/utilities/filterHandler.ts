import { Product } from "../Models";
import { getStartIndex } from "./getStartIndex";

export const filterHandler = async (
  filters: any,
  page: number,
  limit: number,
  perPage: number,
) => {
  const startIndex = getStartIndex(page, limit);

  const query = {
    $and: Object.entries(filters).map(([key, value]) => {
      return { [key]: { $in: value } };
    }),
  };

  const products = await Product.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const total = await Product.countDocuments(query);
  const pages = Math.ceil(Number(total) / perPage);
  const _endIdx = startIndex + limit - 1;
  const endIndex = _endIdx > pages ? pages - 1 : _endIdx;

  const pagination = {
    limit,
    startIndex,
    endIndex,
    page,
    pages,
  };

  return {
    products,
    pagination,
  };
};
