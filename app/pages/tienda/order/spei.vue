<template lang="pug">
UContainer
  p {{`Order: ${order_id}`}}
  p Siguientes pasos:
  
  UPageGrid(tag="ul")
    div(tag="li" class="col-span-1")
      div(v-html="paymentStepsText[0]")
    div(tag="li" v-for="(account, i) in accounts" :key="i" class="col-span-1 sm:col-span-1/3")
      p {{`Banco: ${account.bank_name}`}}
      p {{`Número de cuenta: ${account.account_number}`}}
      p {{`Clabe: ${account.CLABE}`}}
    div(tag="li" class="col-span-1")
      div(v-html="paymentStepsText[1]")
  UButton(to="/" label="Ir a la tienda")
</template>

<script lang="ts" setup>
import type { ConfigCollectionItem } from "@nuxt/content";
import type { SaleOrder } from "~/types";

const { order_id } = useRoute().query;

const config = inject("config", []) as ConfigCollectionItem[];

const businessPage = computed(() => {
  return config.find((c) => c.stem === "config/business");
});

const contactPage = computed(() => {
  return config.find((c) => c.stem === "config/contact");
});

const accounts = businessPage.value?.meta.bank_accounts ?? [];
const contactMail = contactPage.value?.meta.email ?? "";
const paymentStepsText = [
  "Realiza la transferencia o deposito a alguna de estas cuentas: <br><small>(Usar número de orden como referencia de pago)</small>",
  `Envia un correo con tu <strong>número de orden</strong> en el <strong>asunto</strong> y el comprobante de pago a esta dirección: <strong>${contactMail}</strong>`,
];

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
</script>
