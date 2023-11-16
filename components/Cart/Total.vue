<template lang="pug">
.quivi-cart-total
    SrText(value="Total:" kind="title")
    SrText(:value="toPrice(total)" kind="title")
</template>

<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";
defineProps({
  total: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss">
.quivi-cart {
  &-total {
    margin-top: auto;
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
