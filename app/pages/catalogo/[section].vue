<template lang="pug">
.catalogo-detail
    SliderMain(:slides="json.slides" :options="options")
    SrContainer(:with-padding="true")
        SrText(:html="sellerLabel" class="title")
    SliderProducts(:products="highlights" :options="product_options")
    component(v-for="(component, i) in json.content" :is="component.component" :key="i" v-bind="component.props")
    SrContainer(:with-padding="true")
        DownloadsList(:downloads="downloads" :path="path")
</template>

<script lang="ts" setup>
const { path } = useRoute();

const [json, downloads] = await Promise.all([
  $fetch(`/api/content?page=${path}&section=brand,slides,content,products`),
  $fetch(`/api/content/downloads?path=${path}`),
]);

const highlights = await $fetch(`/api/product/hightlights`, {
  method: "POST",
  body: {
    codes: (json as any).products,
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
