<template lang="pug">
div.flex.flex-col.gap-2.border-t-2.border-gray-200.pt-4
    template(v-if="qty > 0")
      p {{ qty }} producto{{ qty > 1 ? 's' : '' }} en el carrito

    .flex.justify-between
      p Subtotal:
      p {{ toPrice(subtotal) }}
    
    .flex.justify-between
      p Envío:
      p {{ Number(shipping.limite) > total ? toPrice(Number(shipping.costo)) : 0 }}

    div.flex.justify-between.font-bold.text-lg
      p.title Total:
      p.title {{ toPrice(total) }}

    UButton(href="/tienda/checkout" label="Pagar" class="mx-auto")
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
