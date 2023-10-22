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
  font-size: unit(26);
  padding: unit(10);
  border-radius: unit(10);
  min-width: unit(150);
  text-align: center;
  a {
    color: currentColor;
  }
}
</style>
