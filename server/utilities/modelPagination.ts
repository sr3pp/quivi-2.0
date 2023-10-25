import { getStartIndex } from "./getStartIndex";

export const modelPagination = async (
  model: any,
  query: any,
  populations: any[],
  page: number,
  limit: number,
  perPage: number,
  key: string,
) => {
  const items = await model
    .find(query)
    .populate(populations)
    .skip((page - 1) * perPage)
    .limit(perPage);
  const startIndex = getStartIndex(page, limit);
  const total = await model.countDocuments(query);
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
    [key]: items,
    pagination,
  };
};
