<template lang="pug">
.quivi-button(:href="href")
    NuxtLink(:to="href" v-if="href" :aria-label="label" :title="label") {{ label }}
    button(v-else) {{ label }}

</template>

<script lang="ts" setup>
defineProps({
  href: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.quivi-button {
  margin: auto;
  background-color: $color-quivi-green;
  color: $color-white;
  font-family: Bebas;
  font-size: pxToRem(26);
  padding: pxToRem(10);
  border-radius: pxToRem(10);
  min-width: pxToRem(150);
  text-align: center;
  a {
    color: currentColor;
    font-family: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    color: currentColor;
    border: none;
    font-family: inherit;
    font-size: inherit;
  }
}
</style>
