<template lang="pug">
.store
    SrGrid
        .sr-grid-col-1(class="sr-grid-col-1/5 column store-filters")
          SrText(value="Encuentra lo que necesitas." kind="subtitle")
          ProductFilters(@filter="filterProducts")
        .sr-grid-col-1(class="sr-grid-col-4/5 column")
          SrText(value="Envios gratis en compras superiores a" kind="subtitle")
          .search-label(v-if="search || filters")
              SrText(value="Resultados de la busqueda" kind="subtitle")
              Button(href="/" label="Ver todos los productos")
          SrGrid(tag="ul")
              li.sr-grid-col-1(class="sr-grid-col-1/4" v-for="(product, i) in products" :key="i")
                ProductCard(:product="product")
          Pagination(:pagination="pagination")

</template>

<script lang="ts" setup>
const route = useRoute();
const { search: _search, page = 1, filters: _filters } = route.query;

const search = ref(_search as string);
const filters = ref(_filters as string);

const { data: content } = await useFetch("/api/content?page=index");

const products = ref([]);
const pagination = ref({});

const fetchProducts = async (goTo: string, search: string, filters?: any) => {
  const query: any = {
    page: goTo,
    search,
  };

  if (filters) {
    query.filters = filters;
  }

  const { data }: any = await useFetch(
    `/api/product${Object.keys(query).length ? "?" : ""}${Object.keys(query)
      .map((key: string) => (query[key] ? `${key}=${query[key]}` : ""))
      .filter(Boolean)
      .join("&")}`,
  );
  products.value = data.value?.products;
  pagination.value = data.value?.pagination;
};

fetchProducts(page as string, search.value as string, filters.value as string);

watch(
  () => route.query,
  async ({ search: _search, page, filters: _filters }) => {
    fetchProducts(page as string, _search as string, _filters);
    search.value = _search as string;
    filters.value = _filters as string;
  },
);

const filterProducts = async (filters: any) => {
  const urlFilters = `${Object.entries(filters)
    .map(([key, value]) => `${key}.${value}`)
    .join("|")}`;
  useRouter().push({
    query: {
      ...route.query,
      filters: urlFilters,
    },
  });
};
</script>

<style lang="scss" scoped>
.store {
  overflow: hidden;
  > .sr-grid {
    margin: 0;
    > * {
      padding-top: unit(40);
    }
  }

  .search-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: unit(20);

    .quivi-button {
      margin-right: unit(20);
    }
  }

  &-filters {
    background-color: $color-near-white;
  }

  .quivi-pagination {
    margin: auto;
  }
}
</style>
