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
      UPagination.mb-10.flex.justify-center(v-model="pageModel" :items-per-page="perPage" :total="pagination.total || 0" @update:page="handlePage" color="primary")

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

const filterProducts = async (filters: Record<string, string | number>) => {
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
