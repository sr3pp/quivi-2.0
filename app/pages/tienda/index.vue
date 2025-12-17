<template lang="pug">
.store
    SrGrid
        SrGridColumn(:size="{mobile: '1', sm: '1/5'}" class="column store-filters")
          SrText(text="Encuentra lo que necesitas." class="subtitle")
          ProductFilters(@filter="filterProducts" :isFiltered="search || filters")
        SrGridColumn(:size="{mobile: '1', sm: '4/5'}" class="column products")
          SrText.store-shipping(class="subtitle" :text="`Envios gratis en compras superiores a: ${shipment.limite} MXN`")
          ContentRenderer(v-if="contentPage?.body" :value="contentPage")
          .search-label(v-if="search || filters")
              SrText(text="Resultados de la busqueda" class="subtitle")
          SrGrid(tag="ul" class="product-grid")
              SrGridColumn(:size="{mobile: '1', sm: '1/4'}" v-for="(product, i) in products" :key="i")
                ProductCard(:product="product")
          Pagination(:pagination="pagination")

</template>

<script lang="ts" setup>
import { fetchProducts } from "@/assets/ts/utilities";
const route = useRoute();
const { search: _search, page: pageQuery = 1, filters: _filters } = route.query;

const search = ref(_search as string);
const filters = ref(_filters as string);

const [{ page: contentPage }, { page: shipmentPage }] = await Promise.all([
  usePageContent(route.path),
  usePageContent("/_config/shipping", { collection: "config" }),
]);
const shipment = computed(() => shipmentPage.value ?? {});

const options = {
  pagination: true,
  navigation: true,
  creative: {
    prev: {
      shadow: false,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
  },
};

const { setShippingConfig } = useCart();

setShippingConfig(shipment.value);

const products = ref([]);
const pagination = ref({});

const { products: _products, pagination: _pagination } = await fetchProducts(
  route.path,
  pageQuery as string,
  search.value as string,
  filters.value as string,
);

products.value = _products;
pagination.value = _pagination;

watch(
  () => route.query,
  async ({ search: _search, page: nextPage, filters: _filters }) => {
    const { products: _products, pagination: _pagination } =
      await fetchProducts(
        route.path,
        nextPage as string,
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

<style lang="scss">
.store {
  overflow: hidden;

  &-shipping {
    align-self: start;
    width: auto;
    padding: pxToRem(10) pxToRem(20);
    background-color: $color-quivi-red;
    color: $color-white;
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
    .store-filters {
      padding-top: pxToRem(16);
      .sr-text {
        margin-bottom: pxToRem(16);
      }
    }
    > *:not(.store-filters) {
      padding-top: pxToRem(0);
    }

    .products {
      padding: 0;
      overflow: hidden;
    }

    .product-grid {
      padding: pxToRem(30) pxToRem(10);
    }
  }

  .search-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: pxToRem(20);

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

  .main-slider {
    &-slide {
      height: pxToRem(250);
      min-height: inherit;
    }
  }
}
</style>
