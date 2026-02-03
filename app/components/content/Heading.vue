<script lang="ts" setup>
defineProps<{
  tag?: string;
  text: string;
  highlight?: string;
}>();
</script>

<template>
  <UContainer>
    <h2 class="text-4xl font-bold mb-6">
      {{ text }}
      <span v-if="highlight" class="text-primary"> {{ highlight }} </span>
    </h2>
  </UContainer>
</template>
