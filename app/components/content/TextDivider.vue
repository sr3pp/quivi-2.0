<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
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
      class="grid grid-cols-12 gap-4 py-10"
      :class="variant == 'with-image' ? 'max-w-lg' : ''"
    >
      <article
        v-if="title"
        class="col-span-1 sm:col-span-2 md:col-span-3 sm:border-r border-gray-300 sm:pr-6"
      >
        <h2 class="text-center text-2xl sm:text-5xl">
          {{ title }}
        </h2>
      </article>
      <article class="col-span-1 sm:col-span-2 md:col-span-9 flex flex-col">
        <p class="text-gray-600 my-auto">
          {{ text }}
        </p>
      </article>
      <figure v-if="imageSrc" class="col-span-1 sm:col-span-2 md:col-span-3">
        <NuxtImg :src="imageSrc" :alt="imageAlt" class="mx-auto" />
      </figure>
      <div v-if="link" class="w-full flex justify-center col-span-12">
        <UButton :to="link.href" color="secondary">
          {{ link.label }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
