import { Product } from "../Models";
import { modelPagination } from "./modelPagination";

export const filterHandler = async (
  filters: any,
  limit: number,
  perPage: number,
  queryObj: any,
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
    [],
    limit,
    perPage,
    "products",
    queryObj,
    "priority",
  );

  return response;
};
