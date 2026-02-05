<script setup lang="ts">
defineProps<{
  title?: string;
  text?: string;
  variant?: string | number;
  image?: {
    src: string;
    alt?: string;
  };
  link?: {
    href: string;
    label: string;
  };
}>();
</script>

<template>
  <section>
    <UContainer
      class="grid grid-cols-12 gap-4 py-10"
      :class="variant == '2' ? 'max-w-lg' : ''"
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
      <figure v-if="image" class="col-span-1 sm:col-span-2 md:col-span-3">
        <NuxtImg :src="image.src" :alt="image.alt" class="mx-auto" />
      </figure>
      <div v-if="link" class="w-full flex justify-center col-span-12">
        <UButton :to="link.href" color="secondary">
          {{ link.label }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
