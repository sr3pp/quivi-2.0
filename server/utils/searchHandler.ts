import { Product } from "../Models";
import { getStartIndex } from "./getStartIndex";
import { modelPagination } from "./modelPagination";

export const searchHandler = async (
  search: string,
  limit: number,
  perPage: number,
  queryObj: any,
) => {
  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { sae: { $regex: search, $options: "i" } },
    ],
  };

  const response = await modelPagination(
    Product,
    query,
    ["brand", "category", "subcategory"],
    [],
    limit,
    perPage,
    "products",
    queryObj,
    "priority",
  );

  return response;
};
