<script setup lang="ts">
defineProps<{
  tag?: String;
  text: String;
  highlight: String;
}>();
</script>

<template>
  <component :is="tag || 'h2'" class="font-bebas text-3xl text-gray-800">
    {{ text }}
    <span class="text-primary"> {{ highlight }} </span>
  </component>
</template>
