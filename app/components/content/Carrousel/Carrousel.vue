<script lang="ts" setup>
import CarrouselSlide from "./CarrouselSlide.vue";
import type { CarouselCta } from "~/types";

const props = defineProps<{
    name: string;
}>();

const { data: slider } = await useAsyncData(
  `carousel-slides-${props.name}`,
  () => queryCollection("sliders").where("stem", "=", `sliders/${props.name}`).first()
);
const slides = computed(() => slider.value?.slides || []);

const { autoplay = false, arrows = true, dots = true } = slider.value || {};

const toCarouselCta = (cta?: {
  label?: string;
  text?: string;
  to?: string;
  link?: string;
  target?: string;
  color?: "primary" | "secondary";
  variant?: "solid" | "outline" | "ghost";
}): CarouselCta | undefined => {
  if (!cta) return undefined;

  const label = cta.label || cta.text;
  const to = cta.to || cta.link;

  if (!label || !to) return undefined;

  return {
    label,
    to,
    target: cta.target,
    color: cta.color,
    variant: cta.variant,
  };
};
</script>

<template>
  <UCarousel
    :arrows="arrows"
    :dots="dots"
    :autoplay="autoplay"
    :items="slides"
  >
    <template #default="{ item: slide }">
      <CarrouselSlide
        :title="slide.title"
        :description="slide.description"
        :eyebrow="slide.eyebrow"
        :image="slide.image"
        :cta="toCarouselCta(slide.cta)"
      />
    </template>
  </UCarousel>
</template>
