<template>
  <UPageGrid :as="tag" :ui="ui">
    <slot />
  </UPageGrid>
</template>

<script lang="ts" setup>
defineProps({
  tag: { type: String, default: "div" },
  ui: {
    type: Object,
    default: () => ({
      base: "relative !grid !grid-cols-1 sm:!grid-cols-6 md:!grid-cols-12 lg:!grid-cols-12 gap-8",
    }),
  },
});
</script>
