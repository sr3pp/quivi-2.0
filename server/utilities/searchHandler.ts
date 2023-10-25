import { Product } from "../Models";
import { getStartIndex } from "./getStartIndex";
import { modelPagination } from "./modelPagination";

export const searchHandler = async (
  search: string,
  page: number,
  limit: number,
  perPage: number,
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
    page,
    limit,
    perPage,
    "products",
  );

  return response;
};
