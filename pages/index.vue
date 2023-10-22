<template lang="pug">
.store
    SrGrid
        .sr-grid-col-1(class="sr-grid-col-1/5 column store-filters")
            SrText(value="Encuentra lo que necesitas." kind="subtitle")
            ProductFilters
        .sr-grid-col-1(class="sr-grid-col-4/5 column")
            SrText(value="Envios gratis en compras superiores a" kind="subtitle")
            SrGrid(tag="ul")
                li.sr-grid-col-1(class="sr-grid-col-1/4")
                    ProductCard

</template>

<script lang="ts" setup>
const { data: content } = await useFetch("/api/content?page=index");
</script>

<style lang="scss" scoped>
.store {
  > .sr-grid {
    margin: 0;
    > * {
      padding-top: unit(40);
    }
  }

  &-filters {
    background-color: $color-near-white;
  }
}
</style>
