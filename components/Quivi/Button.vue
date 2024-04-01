<template lang="pug">
.quivi-button(:href="href" :class="{ 'size-lg': size === 'lg', [variant]: variant }")
    NuxtLink(:to="href" :target="target" :disabled="disabled" v-if="href" :aria-label="label" :title="label") {{ label }}
    button(v-else :disabled="disabled" @click="$emit('buttonclick')") {{ label }}

</template>

<script lang="ts" setup>
defineProps({
  href: {
    type: String,
    default: "",
  },
  target: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
  },
  variant: {
    type: String,
    default: "primary",
  },
});
</script>

<style lang="scss" scoped>
.quivi-button {
  margin: auto;
  color: $color-white;
  font-family: Bebas;
  font-size: pxToRem(26);
  min-width: pxToRem(150);
  max-width: pxToRem(200);
  text-align: center;
  display: flex;

  &.size-lg {
    max-width: pxToRem(300);
  }

  &.secondary {
    min-width: inherit;
    a,
    button {
      background: linear-gradient(
        90deg,
        $color-quivi-light-red 0%,
        $color-quivi-red 100%
      );
      color: $color-white;
      border-radius: pxToRem(40);
    }
  }

  a,
  button {
    padding: pxToRem(10);
    width: 100%;
    font-family: inherit;
    cursor: pointer;
    color: $color-white;
    background-color: $color-quivi-green;
    border-radius: pxToRem(10);
  }

  button {
    border: none;
    font-family: inherit;
    font-size: inherit;

    &[disabled] {
      background-color: $color-quivi-gray;
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
