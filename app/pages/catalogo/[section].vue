<template lang="pug">
.catalogo-detail
    ContentRenderer(v-if="page?.body" :value="page")
    UContainer(:with-padding="true")
        DownloadsList(:downloads="downloads" :path="path")
</template>

<script lang="ts" setup>
const { path } = useRoute();

const [{ page }, downloads] = await Promise.all([
  usePageContent(path),
  $fetch(`/api/content/downloads?path=${path}`),
]);

const highlights = await $fetch(`/api/product/hightlights`, {
  method: "POST",
  body: {
    codes: page.value?.products ?? [],
  },
});

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

const product_options = {
  slidesPerView: "auto",
  centeredSlides: true,
  autoplay: true,
  loop: true,
  creative: {
    prev: {
      shadow: false,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
  },
  breakpoints: {
    744: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 4,
    },
  },
};
</script>
