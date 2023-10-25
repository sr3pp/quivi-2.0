import { Product } from "~/server/Models";
import {
  getStartIndex,
  searchHandler,
  filterHandler,
} from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const {
    search,
    filters,
    page = 1,
    limit = 10,
    perPage = 16,
  }: any = getQuery(event);

  const startIndex = getStartIndex(page, limit);

  if (search) return searchHandler(search, page, limit, perPage);

  if (filters) {
    const filterObj: any = {};
    filters.split("|").forEach((filter: string) => {
      const [key, value] = filter.split(".");
      filterObj[key] = value;
    });
    return filterHandler(filterObj, page, limit, perPage);
  }

  const products = await Product.find()
    .skip((page - 1) * perPage)
    .limit(perPage);

  const total = await Product.countDocuments();
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
});
