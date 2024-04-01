<template lang="pug">
.catalogo-detail
    SliderMain(:slides="content.slides" :options="options")
    SrContainer(:with-padding="true")
        SrText(:html="sellerLabel" class="title")
    SliderProducts(:products="hightlights" :options="product_options")
    component(v-for="(component, i) in content.content" :is="component.component" :key="i" v-bind="component.props")
    SrContainer(:with-padding="true")
        DownloadsList(:downloads="downloads" :path="path")
</template>

<script lang="ts" setup>
const { path } = useRoute();

const [content, downloads] = await Promise.all([
  $fetch(`/api/content?page=${path}`),
  $fetch(`/api/content/downloads?path=${path}`),
]);

const hightlights = await $fetch(
  `/api/product/hightlights?brand=${content.brand}`,
);

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
  slidesPerView: 4,
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
};
</script>

<style lang="scss">
.catalog-detail {
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
}
</style>
