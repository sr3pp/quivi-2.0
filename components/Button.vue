<template lang="pug">
.quivi-button(:href="href")
    NuxtLink(:to="href" v-if="href" :aria-label="label" :title="label") {{ label }}
    button(v-else @click="$emit('buttonclick')") {{ label }}

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
  border-radius: unit(10);
  min-width: unit(150);
  text-align: center;

  &[disabled] {
    background-color: $color-quivi-gray;
    color: $color-white;
    cursor: not-allowed;
    opacity: 0.5;
  }

  a,
  button {
    padding: unit(10);
    color: currentColor;
    width: 100%;
    height: 100%;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
  }
}
</style>
