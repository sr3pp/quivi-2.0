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
const { data } = await useFetch("/api/product?page=" + page);

const { products, pagination }: any = data.value;

if (search) {
  console.log("filter prodcts by search");
}

watch(
  () => route.query,
  ({ search }) => {
    console.log("New query:", search);
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
