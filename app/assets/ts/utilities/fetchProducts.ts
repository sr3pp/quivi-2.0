export const fetchProducts = async (
  path: string,
  goTo: string,
  search: string,
  filters?: any,
  perPage?: number,
) => {
  const query: any = {
    page: goTo,
    search,
  };

  if (filters) {
    query.filters = filters;
  }

  if (perPage) {
    query.perPage = perPage;
  }

  const data: any = await $fetch("/api/product", {
    query: {
      path,
      ...Object.fromEntries(
        Object.entries(query).filter(([, value]) => value !== undefined),
      ),
    },
  });

  return {
    products: data?.products,
    pagination: data?.pagination,
  };
};
