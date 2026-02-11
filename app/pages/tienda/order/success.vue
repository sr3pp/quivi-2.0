<template lang="pug">
.catalogo
    UContainer(:with-padding="true")
        p {{`Order: ${order_id}`}}
        p {{`Transaction: ${order.payment.transaction}`}}
        p {{`Payment Method: ${getPaymentMethod(order.payment.method)}`}}
        SaleProducts(:products="order.products")

        UPageGrid(:style="{marginTop: '0!important'}")
            div(class="col-span-1 sm:col-span-2")
                Shipment(:shipment="order.shipment")
            div(class="col-span-1 sm:col-span-2")
                Bill(:bill="order.bill" v-if="order.bill")

        UButton(label="Ir a Tienda" to="/")

</template>

<script lang="ts" setup>
import { paymentKeyDict } from "@/assets/ts/utilities";
import type { SaleOrder } from "~/types";
const { order_id } = useRoute().query;
const order = await $fetch<SaleOrder>(`/api/sales/${order_id}`);

await $fetch(`/api/send-mail`, {
  method: "POST",
  body: {
    template: "sale",
    to: order.shipment.email,
    subject: "Resumen de compra Quivi.mx",
    context: order,
  },
});

const getPaymentMethod = (name: string) => {
  const r = Object.entries(paymentKeyDict).find(([, value]) => {
    return value == name ? true : false;
  });
  if (!r) {
    return name;
  }
  return r[0].replace(/-/g, " ");
};
</script>
