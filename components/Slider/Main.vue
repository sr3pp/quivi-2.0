<template lang="pug">
Swiper.main-slider(
    :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination, SwiperNavigation]"
    :creative-effect="options.creative"
    v-bind="options"
)
    SwiperSlide.main-slider-slide(v-for="slide in slides" :key="slide")
        SrBackground()
            SrImg(:src="slide.background.mobile" :alt="slide.title")
        SrContainer(:with_space="true")
            SrText(:value="slide.title" kind="title" alignment="center")
            SrText(:value="slide.description" alignment="center")
            NuxtLink(v-if="slide.link" :to="slide.link.url") {{ slide.link.label }}

</template>

<script lang="ts" setup>
const props = defineProps({
  slidesEndpoint: {
    type: String,
    default: "/api/content/slides",
  },
  options: {
    type: Object,
    required: true,
    default: () => ({
      creative: {},
      autoplay: {},
      loop: false,
      perPage: 1,
      effect: "creative",
    }),
  },
});

const { data: slides } = await useFetch(props.slidesEndpoint as string);
</script>

<style lang="scss">
.main-slider {
  width: 100%;
  overflow: hidden;
  &-slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: unit(400);
    overflow: hidden;

    .sr-container {
      position: relative;
      height: 100%;
      z-index: 2;
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

  .swiper {
    &-button {
      &-next,
      &-prev {
        background-color: transparent !important;
      }
    }
  }
}
</style>
