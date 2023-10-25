import { Product } from "../Models";
import { getStartIndex } from "./getStartIndex";
import { modelPagination } from "./modelPagination";

export const filterHandler = async (
  filters: any,
  page: number,
  limit: number,
  perPage: number,
) => {
  const query = {
    $and: Object.entries(filters).map(([key, value]) => {
      return { [key]: { $in: value } };
    }),
  };

  const response = await modelPagination(
    Product,
    query,
    [],
    page,
    limit,
    perPage,
    "products",
  );

  return response;
};
