import { searchHandler } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { limit = 10, perPage = 16 }: any = getQuery(event);
  const { search } = await readBody(event);

  const query = getQuery(event);

  const searchResults: any = await searchHandler(search, limit, perPage, query);
  return {
    products: searchResults.products.map((product: any) => ({
      ...product._doc,
      url: `/producto/${product._id}`,
    })),
    pagination: searchResults.pagination,
  };
});
