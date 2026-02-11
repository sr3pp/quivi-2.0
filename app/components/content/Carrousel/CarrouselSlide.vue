<script lang="ts" setup>
import type { CarouselCta, ResponsiveImage } from "~/types";

const props = defineProps<{
  title?: string;
  description?: string;
  eyebrow?: string;
  image?: ResponsiveImage;
  cta?: CarouselCta;
  alignment?: "left" | "center" | "right";
}>();

const desktopImage = computed(
  () => props.image?.desktop || props.image?.mobile,
);
const mobileImage = computed(() => props.image?.mobile || desktopImage.value);
const alt = computed(() => props.image?.alt || props.title || "Slide");
</script>

<template>
  <article class="relative">
    <picture class="w-full h-full flex">
      <source
        v-if="desktopImage"
        :srcset="desktopImage"
        media="(min-width: 768px)"
      />
      <NuxtImg
        class="w-full"
        :src="mobileImage || desktopImage"
        :alt="alt"
        loading="lazy"
      />
    </picture>

    <UContainer
      class="py-12 relative z-10 absolute top-0 left-0 w-full h-full flex flex-col justify-center"
      :class="{ 'items-center': alignment === 'center' }"
    >
      <p
        v-if="eyebrow"
        class="uppercase tracking-widest text-sm text-gray-500 mb-2"
      >
        {{ eyebrow }}
      </p>
      <h3 v-if="title" class="font-bold text-3xl mb-4">
        {{ title }}
      </h3>
      <p v-if="description" class="text-gray-700 mb-6">
        {{ description }}
      </p>

      <div v-if="cta" class="flex gap-2 flex-wrap">
        <UButton
          :to="cta.to"
          :href="cta.href"
          :target="cta.target"
          :color="cta.color || 'secondary'"
          :variant="cta.variant || 'solid'"
        >
          {{ cta.label }}
        </UButton>
      </div>
    </UContainer>
  </article>
</template>

<style scoped></style>
