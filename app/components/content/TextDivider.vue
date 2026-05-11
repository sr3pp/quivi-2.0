<script setup lang="ts">
withDefaults(defineProps<{
  text?: string;
  variant?: "default" | "with-image";
  imageSrc?: string;
  imageAlt?: string;
  link?: {
    href: string;
    label: string;
  };
}>(), {
  variant: "default",
});
</script>

<template>
  <section>
    <UContainer
      class="grid grid-cols-12 gap-4 sm:gap-8 py-10"
      :class="variant == 'with-image' ? 'max-w-4xl' : ''"
    >
      <article
        v-if="$slots.title"
        class="col-span-1 sm:col-span-2 md:col-span-3 sm:border-r border-gray-300 sm:pr-6"
      >
        <h2 class="text-center text-2xl sm:text-5xl md:text-7xl text-quivi-gray">
          <slot name="title" mdc-unwrap="p"></slot>
        </h2>
      </article>
      <article class="col-span-1 sm:col-span-2 md:col-span-9 flex flex-col text-quivi-dark-gray sm:text-lg md:text-xl gap-4 justify-center">
        <slot />
      </article>
      <figure v-if="imageSrc" class="col-span-1 sm:col-span-2 md:col-span-3">
        <NuxtImg :src="imageSrc" :alt="imageAlt" class="mx-auto" />
      </figure>
      <div v-if="link" class="w-full flex justify-center col-span-12">
        <UButton :to="link.href" size="lg" color="secondary">
          {{ link.label }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
