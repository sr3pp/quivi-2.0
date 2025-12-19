<template>
  <picture class="sr-picture" :class="css.class" :style="css.style">
    <img :src="src" :alt="alt" :width="width" :height="height" />
    <slot />
  </picture>
</template>

<script lang="ts" setup>
defineProps({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  width: { type: [String, Number], default: "auto" },
  height: { type: [String, Number], default: "auto" },
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
.sr-picture {
  width: 100%;
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
</style>
