<template lang="pug">
UPageGrid
    div(class="flex flex-col p-6 store-filters col-span-12 sm:col-span-2 md:col-span-3 gap-2 sticky top-0")
      p.font-bebas.text-3xl Encuentra lo que necesitas.
      ProductFilters(@filter="filterProducts" :filters="filters")
    div(class="column products col-span-12 sm:col-span-4 md:col-span-9 flex flex-col gap-6")
      p.bg-primary-dark.text-white.font-bebas.mr-auto.p-2.text-xl {{`Envios gratis en compras superiores a: ${shipment.meta.content.limite} MXN`}}
      ContentRenderer(v-if="contentPage?.body" :value="contentPage")
      .search-label(v-if="search || filters")
          p.font-bebas.text-2xl Resultados de la busqueda
      UPageGrid.pr-4
          div(class="col-span-1 sm:col-span-6 md:col-span-4" v-for="(product, i) in products" :key="i")
            ProductCard(:product="product")
      UPagination(v-model="pageModel" :items-per-page="perPage" :total="pagination.total || 0" @update:page="handlePage" color="primary")

</template>

<script lang="ts" setup>
import { fetchProducts } from "@/assets/ts/utilities";
const route = useRoute();
const router = useRouter();

const search = computed(() => (route.query.search as string) || "");
const filters = computed(() => (route.query.filters as string) || "");
const pageQuery = computed(() => (route.query.page as string) || "1");
const perPage = 12;

const [{ page: contentPage }, { page: shipmentPage }] = await Promise.all([
  usePageContent(route.path),
  usePageContent("_config/shipping", "config"),
]);

const shipment = computed(
  () => shipmentPage.value || { meta: { content: { limite: 0, costo: 0 } } },
);

const { setShippingConfig } = useCart();

setShippingConfig(
  shipment.value.meta.content as { limite: number; costo: number },
);

const { data: productData, refresh } = await useAsyncData(
  "store-products",
  () =>
    fetchProducts(
      route.path,
      pageQuery.value as string,
      search.value as string,
      filters.value as string,
      perPage,
    ),
);

const products = computed(() => productData.value?.products || []);
const pagination = computed(() => productData.value?.pagination || {});

const pageModel = ref(Number(pageQuery.value || 1));

watch(
  () => route.query,
  async () => {
    pageModel.value = Number(pageQuery.value || 1);
    await refresh();
  },
);

const handlePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      page,
    },
  });
  await refresh();
};

const filterProducts = async (filters: any) => {
  const urlFilters = `${Object.entries(filters)
    .map(([key, value]) => `${key}.${value}`)
    .join("|")}`;
  await router.push({
    query: {
      ...route.query,
      page: 1,
      filters: urlFilters,
    },
  });
  await refresh();
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
