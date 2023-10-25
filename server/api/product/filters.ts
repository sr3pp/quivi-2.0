import { filterHandler } from "~/server/utilities/filterHandler";

export default defineEventHandler(async (event) => {
  const { page = 1, limit = 10, perPage = 16 }: any = getQuery(event);
  const { filters } = await readBody(event);

  return await filterHandler(filters, page, limit, perPage);
});
