<!-- eslint-disable vue/no-v-html -->
<template>
  <component :is="tag" class="sr-text" :class="css.class" :style="css.style">
    <slot v-if="$slots.default" />
    <template v-else-if="html">
      <span v-html="html" />
    </template>
    <template v-else>{{ text }}</template>
  </component>
</template>

<script lang="ts" setup>
defineProps({
  text: { type: [String, Number], default: "" },
  html: { type: String, default: "" },
  tag: { type: String, default: "p" },
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
.sr-text {
  display: block;
}
</style>
