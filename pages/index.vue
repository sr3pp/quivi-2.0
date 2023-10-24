<template lang="pug">
.store
    SrGrid
        .sr-grid-col-1(class="sr-grid-col-1/5 column store-filters")
          SrText(value="Encuentra lo que necesitas." kind="subtitle")
          ProductFilters
        .sr-grid-col-1(class="sr-grid-col-4/5 column")
          SrText(value="Envios gratis en compras superiores a" kind="subtitle")
          .search-label(v-if="search")
              SrText(value="Resultados de la busqueda" kind="subtitle")
              Button(href="/" label="Ver todos los productos")
          SrGrid(tag="ul")
              li.sr-grid-col-1(class="sr-grid-col-1/4" v-for="(product, i) in products" :key="i")
                ProductCard(:product="product")
          Pagination(:pagination="pagination")

</template>

<script lang="ts" setup>
const route = useRoute();
const { search: _search, page = 1 } = route.query;

const search = ref(_search as string);

const { data: content } = await useFetch("/api/content?page=index");

const products = ref([]);
const pagination = ref({});

const fetchProducts = async (goTo: string, search: string) => {
  const query: any = {
    page: goTo,
    search,
  };
  const { data }: any = await useFetch(
    `/api/product${Object.keys(query).length ? "?" : ""}${Object.keys(query)
      .map((key: string) => (query[key] ? `${key}=${query[key]}` : ""))
      .filter(Boolean)
      .join("&")}`,
  );
  products.value = data.value?.products;
  pagination.value = data.value?.pagination;
};

fetchProducts(page as string, search.value as string);

watch(
  () => route.query,
  async ({ search: _search, page }) => {
    fetchProducts(page as string, _search as string);
    search.value = _search as string;
  },
);
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
