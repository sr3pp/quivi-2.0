<script lang="ts" setup>
import type { Product } from "~/types";

const props = defineProps({
  qty: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update-qty", "set-total"]);

const validateInput = ($event: InputEvent) => {
  const targetValue = ($event.target as HTMLInputElement).value;
  const value = targetValue.replace(/[^0-9]/g, "");
  ($event.target as HTMLInputElement).value = value;
};
</script>

<template lang="pug">
.incrementor
  button(@click="qty > 1 ? $emit('update-qty', -1) : null") -
  input.sr-form-input(:value="qty" @input="validateInput" type="number" min="1" :max="max")
  button(@click="qty < max ? $emit('update-qty', 1) : null") +
</template>

<style lang="scss" scoped>
.incrementor {
  display: flex;
  gap: pxToRem(10);
  margin: auto;
  width: 100%;
  justify-content: center;
  padding: pxToRem(10) 0;
  button {
    font-weight: bold;
    width: pxToRem(30);
    flex-shrink: 0;
    appearance: none;
    border: none;
    border-radius: pxToRem(5);
    color: $color-white;
    background: $color-quivi-green;
    text-align: center;
  }
  .sr-form-input {
    width: pxToRem(50);
    border-radius: pxToRem(5);
    border: {
      style: solid;
      color: $color-quivi-gray;
      width: pxToRem(2);
    }
    text-align: center;

    &[type="number"]::-webkit-outer-spin-button,
    &[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
    }
  }
}
</style>
