<template lang="pug">
Swiper.product-slider(
  :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination, SwiperNavigation]"
  v-bind="options"
  :navigation="true"
  :spaceBetween="40"
  :creative-effect="options.creative"
)
  SwiperSlide.product-slider-slide(v-for="slide in products" :key="slide")
    ProductCard(:product="slide")
  SwiperSlide.product-slider-slide(v-for="slide in products" :key="slide")
    ProductCard(:product="slide")

</template>

<script lang="ts" setup>
const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    required: true,
    default: () => ({
      creative: {},
      autoplay: false,
      loop: false,
      slidesPerView: 3,
      spaceBetween: 20,
      effect: "creative",
    }),
  },
});
</script>

<style lang="scss">
.product-slider {
  width: 100%;
  padding: 0;
  margin: 0;

  &-slide {
    overflow: hidden;
    height: auto;

    margin-left: pxToRem(-10);
    width: 80vw;

    @media (min-width: #{$breakpoint-md}) {
      width: auto;
      margin-left: 0;
    }

    .quivi-product-card {
      height: 100%;
    }
  }
}
</style>
