<template lang="pug">
Swiper.product-slider(
  :modules="[SwiperAutoplay, SwiperEffectCreative]"
  :slides-per-view="options.perPage"
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
      autoplay: {},
      loop: false,
      perPage: 3,
      effect: "creative",
    }),
  },
});

const { data: slides } = await useFetch(props.slidesEndpoint as string);
</script>

<style lang="scss">
.product-slider {
  width: 100%;
  position: relative;

  &-slide {
    overflow: hidden;

    .sr-container {
      position: relative;
      height: 100%;
    }

    .sr-text {
      &.kind {
        &-title {
          font-size: unit(40);
          margin-bottom: unit(40);
        }
      }
    }
  }
}
</style>
