import { Product } from "~/types";
import { Product as ProductModel } from "~/server/Models";
import { searchHandler } from "~/server/utilities";

const getStartIndex = (page: number, limit: number) => {
  return Math.floor((page - 1) * (limit / 100)) * 10;
};

export default defineEventHandler(async (event) => {
  const { page = 1, limit = 10, perPage = 16 }: any = getQuery(event);
  const { search } = await readBody(event);

  const searchResults: any = await searchHandler(search, page, limit, perPage);
  return {
    products: searchResults.products.map((product: any) => ({
      ...product._doc,
      url: `/producto/${product.web}`,
    })),
    pagination: searchResults.pagination,
  };
});
