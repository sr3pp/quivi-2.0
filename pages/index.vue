<template lang="pug">
.store
    SrGrid
        SrGridColumn(:size="{mobile: '1', sm: '1/5'}" class="column store-filters")
          SrText(text="Encuentra lo que necesitas." class="subtitle")
          ProductFilters(@filter="filterProducts")
        SrGridColumn(:size="{mobile: '1', sm: '4/5'}" class="column")
          SrText.store-shipping(class="subtitle" :text="`Envios gratis en compras superiores a: ${shipment.limite} MXN`")
          .search-label(v-if="search || filters")
              SrText(text="Resultados de la busqueda" class="subtitle")
              QuiviButton(href="/" label="Ver todos los productos" disabled)
          SrGrid(tag="ul")
              SrGridColumn(:size="{mobile: '1', sm: '1/4'}" v-for="(product, i) in products" :key="i")
                ProductCard(:product="product")
          Pagination(:pagination="pagination")

</template>

<script lang="ts" setup>
import { fetchProducts } from "@/assets/ts/utilities";
const route = useRoute();
const { search: _search, page = 1, filters: _filters } = route.query;

const search = ref(_search as string);
const filters = ref(_filters as string);

const promises: any = await Promise.all([
  $fetch("/api/content?page=index"),
  $fetch("/api/content?page=_config/shipping"),
]);

const content = promises[0];
const { shipment } = promises[1];

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
  subtotal: 0,
  shipping: shipment,
});

const products = ref([]);
const pagination = ref({});

const { products: _products, pagination: _pagination } = await fetchProducts(
  route.path,
  page as string,
  search.value as string,
  filters.value as string,
);

products.value = _products;
pagination.value = _pagination;

watch(
  () => route.query,
  async ({ search: _search, page, filters: _filters }) => {
    const { products: _products, pagination: _pagination } =
      await fetchProducts(
        route.path,
        page as string,
        _search as string,
        _filters,
      );
    search.value = _search as string;
    filters.value = _filters as string;
    products.value = _products;
    pagination.value = _pagination;
  },
);

const filterProducts = async (filters: any) => {
  const urlFilters = `${Object.entries(filters)
    .map(([key, value]) => `${key}.${value}`)
    .join("|")}`;
  useRouter().push({
    query: {
      filters: urlFilters,
    },
  });
};
</script>

<style lang="scss" scoped>
.store {
  overflow: hidden;

  &-shipping {
    align-self: start;
    width: auto;
    padding: pxToRem(10) pxToRem(20);
    background-color: $color-quivi-red;
    color: $color-white;
    margin-bottom: pxToRem(20);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: pxToRem(-10);
      width: pxToRem(20);
      height: 100%;
      background-color: $color-quivi-red;
      z-index: 1;
    }
  }

  > .sr-grid {
    margin: 0;
    > * {
      padding-top: pxToRem(40);
    }
  }

  .search-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: pxToRem(20);

    .quivi-button {
      margin-right: pxToRem(20);
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
