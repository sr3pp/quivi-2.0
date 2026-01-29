<script lang="ts" setup>
import CarrouselSlide from "./CarrouselSlide.vue";

const props = withDefaults(
  defineProps<{
    autoplay?: boolean;
    arrows?: boolean;
    dots?: boolean;
  }>(),
  {
    autoplay: false,
    arrows: true,
    dots: true,
  },
);

const slots = useSlots();

const autoplayOptions = computed(() => {
  return props.autoplay
    ? { delay: 5000, stopOnMouseEnter: true, stopOnInteraction: true }
    : false;
});

const slotSlides = computed(() => (slots.default?.() || []).filter(Boolean));
const slotItems = computed(() =>
  slotSlides.value.map((vnode, index) => ({
    vnode,
    key: vnode.key ?? `slide-${index}`,
  })),
);
const useSlotSlides = computed(() => slotItems.value.length > 0);
</script>

<template>
  <UCarousel
    v-if="useSlotSlides"
    :items="slotItems"
    :arrows="arrows"
    :dots="dots"
    :autoplay="autoplayOptions"
    class="content-carousel"
  >
    <template #default="{ item }">
      <component
        :is="item.vnode || CarrouselSlide"
        v-bind="item.vnode?.props"
        :key="item.key"
      />
    </template>
  </UCarousel>
</template>

<style scoped>
.content-carousel {
  --content-carousel-radius: 18px;
  --content-carousel-background: #f7f7f9;
  --content-carousel-text: #1f1f25;
}

.content-carousel__item {
  padding: 12px;
}
</style>
