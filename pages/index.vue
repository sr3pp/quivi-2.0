<template lang="pug">
.store
    SrGrid
        .sr-grid-col-1(class="sr-grid-col-1/5 column store-filters")
            SrText(value="Encuentra lo que necesitas." kind="subtitle")
            ProductFilters
        .sr-grid-col-1(class="sr-grid-col-4/5 column")
            SrText(value="Envios gratis en compras superiores a" kind="subtitle")
            SrGrid(tag="ul")
                li.sr-grid-col-1(class="sr-grid-col-1/4" v-for="(product, i) in products" :key="i")
                    ProductCard(:product="product")
            Pagination(:pagination="pagination")

</template>

<script lang="ts" setup>
const route = useRoute();
const { search, page = 1 } = route.query;

const { data: content } = await useFetch("/api/content?page=index");

const products = ref([]);
const pagination = ref({});

const fetchProducts = async (goTo: string) => {
  const { data }: any = await useFetch("/api/product?page=" + goTo);
  products.value = data.value?.products;
  pagination.value = data.value?.pagination;
};

const searchProducts = async (term: string, goTo: string) => {
  const { data }: any = await useFetch("/api/product/search?page=" + goTo, {
    method: "POST",
    body: JSON.stringify({ search: term }),
  });

  products.value = data.value?.products;
  pagination.value = data.value?.pagination;
};

if (search) {
  searchProducts(search as string, page as string);
} else {
  fetchProducts(page as string);
}

watch(
  () => route.query,
  async ({ search, page }) => {
    if (page) {
      fetchProducts(page as string);
    } else if (search) {
      searchProducts(search as string, page ? (page as string) : "1");
    }
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

  &-filters {
    background-color: $color-near-white;
  }

  .quivi-pagination {
    margin: auto;
  }
}
</style>
