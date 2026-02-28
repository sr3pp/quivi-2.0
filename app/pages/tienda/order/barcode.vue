<template lang="pug">
.barcode
    UContainer(:with-padding="true")
        p {{`Numero de orden: ${order_id}`}}
        p Siguientes pasos:
        div(v-html="steps[0]")
        div(v-html="steps[1]")
        iframe(:src="reciptUrl" width="100%" height="1000px" ref="iframe")
        UButton(label="Imprimir" :to="reciptUrl" target="_blank")
</template>

<script lang="ts" setup>
import type { ConfigEntry, SaleOrder } from "~/types";

const {
  public: { openpay },
} = useRuntimeConfig();
const config = openpay as { barcodeUrl: string; merchantId: string };
const baseUrl = config.barcodeUrl;
const merchId = config.merchantId;
const { order_id, reference } = useRoute().query;
const reciptUrl = `${baseUrl}${merchId}/${reference}`;

const configData = inject("config", []) as ConfigEntry[];

const contactPage = computed(() => {
  return configData.find((c) => c.stem === "config/contact");
});

const email = contactPage.value?.email ?? "";

const iframe: Ref<HTMLIFrameElement | null> = ref(null);

const steps = [
  "Sigue las instrucciones del recibo.",
  `Envia un correo con tu <strong>número de orden</strong> en el <strong>asunto</strong> y el comprobante de pago a esta dirección: <strong>${email}</strong>.`,
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

const printRecipt = () => {
  const reciptEl = iframe.value?.contentWindow;
  reciptEl?.focus();
};
</script>
