<template lang="pug">
NuxtImg(:key="imgKey" :src="imgSrc" :alt="altText" @error="onImgError" v-bind="$attrs")
</template>

<script lang="ts" setup>
import type { Product } from "~/types";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  product: {
    type: Object as () => Partial<Product>,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  fallbackSrc: {
    type: String,
    default: "/img/product_holder.webp",
  },
});

const route = useRoute();

const resolveProductSrc = (
  product: Partial<Product>,
  fallbackSrc: string,
): string => {
  const thumb = product?.thumbs?.[0];
  if (!thumb) {
    return fallbackSrc;
  }

  if (/^https?:\/\//i.test(thumb as string)) {
    return thumb as string;
  }

  return `/products/${product.web}/${thumb}`;
};

const hasError = ref(false);
const imgKey = ref(0);

const targetSrc = computed(() =>
  resolveProductSrc(props.product, props.fallbackSrc),
);

const imgSrc = computed(() => {
  if (hasError.value) {
    return props.fallbackSrc;
  }

  return targetSrc.value;
});

const validateImage = (src: string): void => {
  if (!import.meta.client || !src || src === props.fallbackSrc) {
    return;
  }

  const testImage = new Image();
  testImage.onload = () => {
    // No-op: a successful load keeps the original source.
  };
  testImage.onerror = () => {
    hasError.value = true;
  };
  testImage.src = src;
};

watch(
  () => props.product,
  () => {
    hasError.value = false;
    imgKey.value += 1;
  },
  { deep: true },
);

watch(
  () => route.fullPath,
  () => {
    hasError.value = false;
    imgKey.value += 1;
  },
);

watch(
  () => props.fallbackSrc,
  () => {
    imgKey.value += 1;
  },
);

watch(
  targetSrc,
  (nextSrc) => {
    hasError.value = false;
    validateImage(nextSrc);
  },
  { immediate: true },
);

const altText = computed(
  () => props.alt || props.product?.name || "Product image",
);

const onImgError = (): void => {
  hasError.value = true;
};
</script>
