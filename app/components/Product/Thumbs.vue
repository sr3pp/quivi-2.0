<script lang="ts" setup>
import type { Product } from "~/types";

const props = defineProps({
  thumbs: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  productName: {
    type: String,
    default: "",
  },
  productId: {
    type: String,
    default: "",
  },
});

const currentThumb = ref<string | undefined>(props.thumbs.at(0));

const changeThumb = (thumb: string) => {
  currentThumb.value = thumb;
};

const buildProduct = (thumb: string | undefined): Partial<Product> => ({
  name: props.productName,
  web: props.productId,
  thumbs: thumb ? [thumb] : [],
});

const mainProduct = computed(() => buildProduct(currentThumb.value));
</script>

<template lang="pug">
.quivi-product-thumbs
    ProductImage(:product="mainProduct" :alt="productName" width="100%" height="100%")
    ul.quivi-product-thumbs-list
      template(v-for="(thumb, i) in thumbs.filter(th => th)" :key="i")
        li.quivi-product-thumbs-item(v-if="thumb !== currentThumb")
          button(@click="changeThumb(thumb)")
            ProductImage(:product="buildProduct(thumb)" :alt="productName")
</template>

<style lang="scss">
.quivi-product-thumbs {
  &-list {
    display: flex;
    justify-content: space-between;
    margin-top: pxToRem(10);
    overflow: scroll;
    gap: pxToRem(10);
  }

  &-item {
    width: 33.3333%;
    flex-shrink: 0;
  }
}
</style>
