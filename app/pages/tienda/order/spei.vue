<template lang="pug">
UContainer.flex.flex-col.gap-4.py-10
  p.font-bebas.text-3xl {{`Orden: ${order_id || ""}`}}
  p.font-bold Siguientes pasos:
  
  div.flex.flex-col.gap-4
    div(v-html="paymentStepsText[0]")
    UPageGrid
      div(tag="li" v-for="(account, i) in accounts" :key="i" class="col-span-12 sm:col-span-6 md:col-span-4")
        p {{`Banco: ${account.bank_name}`}}
        p {{`Número de cuenta: ${account.account_number}`}}
        p {{`Clabe: ${account.CLABE}`}}
    div(v-html="paymentStepsText[1]")
  UButton.mx-auto(to="/" label="Ir a la tienda")
</template>

<script lang="ts" setup>
import type { ConfigEntry, SaleOrder } from "~/types";

const { order_id } = useRoute().query;



const { data: contact } = await useNuxtData("config-contact");
const { data: businessPage } = await useNuxtData("config-business");

const accounts = businessPage.value?.bank_accounts ?? [];
const contactMail = contact.value?.email ?? "";
const paymentStepsText = [
  "Realiza la transferencia o deposito a alguna de estas cuentas: <br><small>(Usar número de orden como referencia de pago)</small>",
  `Envia un correo con tu <strong>número de orden</strong> en el <strong>asunto</strong> y el comprobante de pago a esta dirección: <strong>${contactMail}</strong>`,
];

const order = await $fetch<SaleOrder>(`/api/sales/${order_id}`);

  if (order) {
    await $fetch(`/api/send-mail`, {
      method: "POST",
      body: {
        template: "sale",
        to: order.shipment.email,
        subject: "Resumen de compra Quivi.mx",
        context: order,
      },
    });
  }
</script>
