<template lang="pug">
.barcode
    UContainer(:with-padding="true")
        SrText(:text="`Numero de orden: ${order_id}`" class="title")
        SrText(text="Siguientes pasos:" class="subtitle")
        SrText(:html="steps[0]")
        SrText(:html="steps[1]")
        iframe(:src="reciptUrl" width="100%" height="1000px" ref="iframe")
        UButton(label="Imprimir" :to="reciptUrl" target="_blank")
</template>

<script lang="ts" setup>
import type { SaleOrder } from "~/types";

const {
  public: { openpay },
} = useRuntimeConfig();
const config = openpay as { barcodeUrl: string; merchantId: string };
const baseUrl = config.barcodeUrl;
const merchId = config.merchantId;
const { order_id, reference } = useRoute().query;
const reciptUrl = `${baseUrl}${merchId}/${reference}`;

const { page: contactPage } = await usePageContent("/_config/contact", "config");
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

<style lang="scss" scoped>
.barcode {
  .sr-container {
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(20);
      }
    }
  }
}
</style>
