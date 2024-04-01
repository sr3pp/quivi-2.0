<template lang="pug">
.quivi-cart-detail
    SrText(text="Detalle de la compra" class="subtitle")
    SrText(:text="`${qty} producto${qty > 1 ? 's' : ''}`")

    .quivi-cart-detail-subtotal
      SrText(text="Subtotal:")
      SrText(:text="toPrice(subtotal)")
    
    .quivi-cart-detail-shipping
      SrText(text="Envío:")
      SrText(:text="Number(shipping.limite) > total ? toPrice(Number(shipping.costo)) : 0")

    div.quivi-cart-detail-total
      SrText(text="Total:" class="title")
      SrText(:text="toPrice(total)" class="title")

    QuiviButton.quivi-cart-pay-button(href="/tienda/checkout" label="pagar")
</template>

<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";
defineProps({
  subtotal: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Object,
    default: () => ({
      costo: 0,
      limite: 0,
    }),
  },
  total: {
    type: Number,
    default: 0,
  },
  qty: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss">
.quivi-cart-detail {
  margin-top: auto !important;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;

  padding: pxToRem(20) !important;

  border-top: {
    style: solid;
    color: $color-quivi-gray;
    width: pxToRem(2);
  }

  > * {
    &:not(:last-child) {
      margin-bottom: pxToRem(10);
    }
  }

  &-total,
  &-shipping,
  &-subtotal {
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .sr-text:not(.title) {
      * {
        font-family: Inria;
      }
    }
  }
}
</style>
