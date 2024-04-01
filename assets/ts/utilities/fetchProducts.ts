export const fetchProducts = async (
  path: string,
  goTo: string,
  search: string,
  filters?: any,
) => {
  const query: any = {
    page: goTo,
    search,
  };

  if (filters) {
    query.filters = filters;
  }

  const { data }: any = await useFetch(
    `/api/product${
      Object.keys(query).length ? `?path=${path}&` : ""
    }${Object.keys(query)
      .map((key: string) => (query[key] ? `${key}=${query[key]}` : ""))
      .filter(Boolean)
      .join("&")}`,
  );

  return {
    products: data.value?.products,
    pagination: data.value?.pagination,
  };
};
