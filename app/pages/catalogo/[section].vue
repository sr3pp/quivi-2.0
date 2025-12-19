<template lang="pug">
.catalogo-detail
    SliderMain(:slides="page?.slides || []" :options="options")
    SrContainer(:with-padding="true")
        SrText(:html="sellerLabel" class="title")
    SliderProducts(:products="highlights" :options="product_options")
    ContentRenderer(v-if="page?.body" :value="page")
    SrContainer(:with-padding="true")
        DownloadsList(:downloads="downloads" :path="path")
</template>

<script lang="ts" setup>
const { path } = useRoute();

const [{ page }, downloads] = await Promise.all([
  usePageContent(path),
  $fetch(`/api/content/downloads?path=${path}`),
]);

console.log(page.value);

const highlights = await $fetch(`/api/product/hightlights`, {
  method: "POST",
  body: {
    codes: page.value?.products ?? [],
  },
});

const sellerLabel =
  "Nuestros Productos <span class='text-quivi-light-red'>mas vendidos</span>";

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

<style lang="scss">
.catalogo-detail {
  &-description {
    .sr-text {
      &:not(:last-of-type) {
        margin-bottom: pxToRem(20);
      }
    }
    .sr-picture.limit-height {
      display: flex;
      max-height: pxToRem(250);
      img {
        width: auto;
        height: 100%;
        object-fit: contain;
        margin: auto;
      }
    }
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(20);
      }
    }
  }

  .sr-container {
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(40);
      }
    }
  }

  .product-slider {
    margin-bottom: pxToRem(40);
  }
}
</style>
