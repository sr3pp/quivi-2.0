<template>
  <UPageGrid
    :as="tag"
    class="sr-grid"
    :class="{ [css.class]: css.class }"
    :style="css.style"
  >
    <slot />
  </UPageGrid>
</template>

<script lang="ts" setup>
defineProps({
  tag: { type: String, default: "div" },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});
</script>
