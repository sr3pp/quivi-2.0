import { getStartIndex } from "./getStartIndex";

export const modelPagination = async (
  model: any,
  query: any,
  populations: any[],
  limit: number,
  perPage: number,
  key: string,
  queryObj: any,
  order?: string,
) => {
  const page = queryObj && queryObj.page ? Number(queryObj.page) : 1;
  const items = await model
    .find(query)
    .sort(order ? { [order]: -1 } : {})
    .populate(populations)
    .skip((page - 1) * perPage)
    .limit(perPage);
  const startIndex = getStartIndex(page, limit);
  const total = await model.countDocuments(query);
  const pages = Math.ceil(Number(total) / perPage);
  const _endIdx = startIndex + limit - 1;
  const endIndex = _endIdx > pages ? pages - 1 : _endIdx;

  const entries = Object.entries(queryObj);
  if (!Object.keys(queryObj).includes("page")) {
    entries.unshift(["page", page]);
  }

  const buildPageUrl = (sw: boolean) => {
    if (entries.length) {
      return `?${entries
        .map(([key, value]) => {
          if (key === "page") {
            return `${key}=${sw ? page + 1 : page - 1}`;
          }
          return `${key}=${value}`;
        })
        .join("&")}`;
    }

    return "/";
  };

  const nextPage = buildPageUrl(true);
  const prevPage = buildPageUrl(false);

  const pagination = {
    limit,
    startIndex,
    endIndex,
    page,
    pages,
    nextPage,
    prevPage,
  };

  return {
    [key]: items,
    pagination,
  };
};
