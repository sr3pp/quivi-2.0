<template>
  <UPageColumns :is="tag" :class="css.class">
    <slot />
  </UPageColumns>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  span: {
    type: [Number, Object],
    default: 12,
  },
  tag: {
    type: String,
    default: "div",
  },
  css: {
    type: Object,
    default: () => ({
      class: "",
    }),
  },
});
</script>
