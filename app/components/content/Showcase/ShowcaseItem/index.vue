<script setup lang="ts">
defineProps<{
  title: string;
  image: {
    src: string;
    alt: string;
  };
}>();
</script>

<template>
  <article class="flex gap-2 col-span-12 sm:col-span-6">
    <figure class="w-full sm:w-1/3">
      <img :src="image.src" :alt="image.alt" />
    </figure>
    <div class="flex flex-col justify-between">
      <h3 class="font-bold text-3xl mb-4">{{ title }}</h3>
      <ul class="list-none flex flex-col gap-2 p-0 m-0">
        <slot />
      </ul>
    </div>
  </article>
</template>
