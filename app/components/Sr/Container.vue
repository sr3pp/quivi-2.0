<template>
  <UContainer
    :as="tag"
    class="sr-container"
    :class="{ contained, withPadding, [css.class]: css.class }"
  >
    <slot />
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps({
  tag: { type: String, default: "div" },
  contained: { type: Boolean, default: true },
  withPadding: { type: Boolean, default: false },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});
</script>

<style scoped>
.sr-container.withPadding {
  padding-block: 20px;
}
</style>
