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
div
  ProductImage(:product="mainProduct" :alt="productName" width="100%" height="100%")
  ul(class="mt-2.5 flex gap-2.5 overflow-x-auto")
    template(v-for="(thumb, i) in thumbs.filter(th => th)" :key="i")
      li(v-if="thumb !== currentThumb" class="w-1/3 shrink-0")
        button(class="w-full" @click="changeThumb(thumb)")
          ProductImage(:product="buildProduct(thumb)" :alt="productName")
</template>
