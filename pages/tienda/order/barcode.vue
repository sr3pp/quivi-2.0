<template lang="pug">
.barcode
    SrContainer(:with-padding="true")
        SrText(:text="`Numero de orden: ${order_id}`" class="title")
        SrText(text="Siguientes pasos:" class="subtitle")
        SrText(:text="steps[0]")
        SrText(:text="steps[1]")
        iframe(:src="reciptUrl" width="100%" height="1000px" ref="iframe")
        QuiviButton(label="Imprimir" :href="reciptUrl" target="_blank")
</template>

<script lang="ts" setup>
const { public: config }: any = useRuntimeConfig();
const baseUrl = config.openpay.barcodeUrl;
const merchId = config.openpay.merchantId;
const { order_id, reference } = useRoute().query;
const reciptUrl = `${baseUrl}${merchId}/${reference}`;

const { email } = await $fetch("/api/content?page=_config/contact");

const iframe: Ref<HTMLIFrameElement | null> = ref(null);

const steps = [
  "Sigue las instrucciones del recibo.",
  `Envia un correo con tu <strong>número de orden</strong> en el <strong>asunto</strong> y el comprobante de pago a esta dirección: <strong>${email}</strong>.`,
];
const printRecipt = () => {
  const reciptEl: any = (iframe.value as HTMLIFrameElement).contentWindow;
  console.log("printRecipt", iframe.value, reciptEl);
  reciptEl.focus();
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
