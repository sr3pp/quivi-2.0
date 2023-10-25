import { Product } from "~/server/Models";
import {
  getStartIndex,
  searchHandler,
  filterHandler,
  modelPagination,
} from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const {
    search,
    filters,
    page = 1,
    limit = 10,
    perPage = 16,
  }: any = getQuery(event);

  if (search) return searchHandler(search, page, limit, perPage);

  if (filters) {
    const filterObj: any = {};
    filters.split("|").forEach((filter: string) => {
      const [key, value] = filter.split(".");
      filterObj[key] = value;
    });
    return filterHandler(filterObj, page, limit, perPage);
  }

  const response = await modelPagination(
    Product,
    {},
    [],
    page,
    limit,
    perPage,
    "products",
  );
  return response;
});
