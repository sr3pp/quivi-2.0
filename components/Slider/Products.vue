<template lang="pug">
Swiper.product-slider(
  :modules="[SwiperAutoplay, SwiperEffectCreative]"
  :slidesPerView="options.slidesPerView"
  :spaceBetween="options.spaceBetween"
  :loop="options.loop"
  :effect="options.effect"
  :autoplay="options.autoplay"
  :creative-effect="options.creative"
)
  SwiperSlide.product-slider-slide(v-for="slide in slides" :key="slide")
    SrText(:value="slide.name" kind="subtitle" alignment="center")

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

const { data: slides } = await useFetch(props.slidesEndpoint as string);
</script>

<style lang="scss">
.product-slider {
  width: 100%;

  &-slide {
    overflow: hidden;
  }
}
</style>
