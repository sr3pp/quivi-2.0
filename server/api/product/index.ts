import { Product } from "~/server/Models";
import {
  getStartIndex,
  searchHandler,
  filterHandler,
  modelPagination,
} from "~/server/utilities";

export default defineEventHandler(async (event: any) => {
  const query = getQuery(event);
  const { search, filters, limit = 10, perPage = 16 }: any = query;

  if (search) return searchHandler(search, limit, perPage, query);

  if (filters) {
    const filterObj: any = {};
    filters.split("|").forEach((filter: string) => {
      const [key, value] = filter.split(".");
      filterObj[key] = value;
    });
    return filterHandler(filterObj, limit, perPage, query);
  }

  const response = await modelPagination(
    Product,
    {},
    [],
    [],
    limit,
    perPage,
    "products",
    query,
    "priority",
  );
  return response;
});
