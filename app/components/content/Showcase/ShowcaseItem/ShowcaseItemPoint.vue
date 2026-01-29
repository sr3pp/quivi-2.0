<script setup lang="ts">
defineProps<{
  icon: string;
  text: string;
}>();
</script>

<template>
  <li class="flex items-center gap-2 text-xl">
    <SrIcon :name="icon || 'quivi-check-o'" />
    {{ text }}
  </li>
</template>
