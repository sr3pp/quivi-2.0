<template lang="pug">
NuxtLink.quivi-button(:class="{ 'size-lg': size === 'lg', [variant]: variant, loading, disabled: isDisabled }" :to="href" :target="target" v-if="href" :aria-label="label" :title="label") 
  span.label {{ label }}
  slot
  span.loader
    Spinner(v-if="loading")

button.quivi-button(v-else :class="{ 'size-lg': size === 'lg', [variant]: variant, loading, disabled: isDisabled }") 
  span.label {{ label }}
  slot
  span.loader
    Spinner(v-if="loading")

</template>

<script lang="ts" setup>
const props = defineProps({
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
  loading: {
    type: Boolean,
    default: false,
  },
});

const isDisabled = computed(() => {
  return props.disabled || props.loading;
});
</script>

<style lang="scss" scoped>
button.quivi-button,
a.quivi-button {
  border: none;

  &[disabled],
  &.disabled {
    background-color: $color-quivi-gray;
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
}
.quivi-button {
  position: relative;
  margin: auto;
  color: $color-white;
  font-family: Bebas;
  font-size: pxToRem(26);
  min-width: pxToRem(150);
  max-width: pxToRem(200);
  text-align: center;
  padding: pxToRem(10);
  cursor: pointer;
  background-color: $color-quivi-green;
  border-radius: pxToRem(10);
  line-height: 1;

  &.size-lg {
    max-width: pxToRem(300);
  }

  &.secondary {
    min-width: inherit;
    max-width: inherit;
    font-family: inria;
    font-size: pxToRem(18);
    background: linear-gradient(
      90deg,
      $color-quivi-light-red 0%,
      $color-quivi-red 100%
    );
    color: $color-white;
    border-radius: pxToRem(40);
    padding-right: pxToRem(20);
    padding-left: pxToRem(20);
  }

  .loader {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner {
    width: pxToRem(30);
    height: pxToRem(30);
  }

  &.loading {
    background: rgba($color-quivi-light-red, $alpha: 0.4);
    .label {
      opacity: 0.3;
    }
  }
}
</style>
