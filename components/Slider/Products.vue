<template lang="pug">
Swiper.product-slider(
  :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination, SwiperNavigation]"
  v-bind="options"
  :navigation="true"
  :spaceBetween="40"
  :creative-effect="options.creative"
)
  SwiperSlide.product-slider-slide(v-for="slide in slides" :key="slide")
    ProductCard(:product="slide")
  SwiperSlide.product-slider-slide(v-for="slide in slides" :key="slide")
    ProductCard(:product="slide")

</template>

<script lang="ts" setup>
const props = defineProps({
  slidesEndpoint: {
    type: String,
    default: "/api/product/hightlights",
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

const slides = await $fetch(props.slidesEndpoint as string);
</script>

<style lang="scss">
.product-slider {
  width: 100%;

  &-slide {
    overflow: hidden;
  }
}
</style>
