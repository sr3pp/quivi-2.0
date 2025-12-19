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

<style scoped lang="scss">
.sr-text {
  display: block;

  &.title {
    font-family: Bebas;

    font-size: pxToRem(16);

    @media (min-width: #{$breakpoint-md}) {
      font-size: pxToRem(36);
    }
  }

  &.subtitle {
    font-family: Bebas;
    font-weight: bold;

    font-size: pxToRem(16);

    @media (min-width: #{$breakpoint-md}) {
      font-size: pxToRem(22);
    }
  }
}
</style>
