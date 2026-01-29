<script setup lang="ts">
defineProps<{
  image: {
    src: string;
    alt: string;
  };
}>();
</script>

<template>
  <div class="flex items-center justify-center">
    <img :src="image.src" :alt="image.alt" class="max-h-12 object-contain" />
  </div>
</template>
