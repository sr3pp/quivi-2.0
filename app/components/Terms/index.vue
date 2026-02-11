<script setup lang="ts">
defineProps<{
  terms: Array<{
    title: string;
    content: string;
  }>;
}>();
</script>

<template>
  <ul class="flex flex-col gap-4">
    <li v-for="(section, i) in terms" :key="`${Date.now()}-terms-section-${i}`">
      <p class="font-bebas text-2xl">
        {{ section.title }}
      </p>
      <p>
        {{ section.content }}
      </p>
    </li>
  </ul>
</template>
>
