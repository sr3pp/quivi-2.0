<template lang="pug">
.checkout-spei
  SrContainer(:with-padding="true")
    SrText(:text="`Order: ${order_id}`" class="title")
    SrText(text="Siguientes pasos" class="subtitle")
    
    SrGrid(tag="ul")
      SrGridColumn(tag="li" :size="{mobile: '1'}")
        SrText(:text="paymentStepsText[0]")
      SrGridColumn(tag="li" v-for="(account, i) in accounts" :key="i" :size="{mobile: '1', sm: '1/3'}")
        SrText(:text="`Banco: ${account.bank_name}`" class="subtitle")
        SrText(:text="`Número de cuenta: ${account.account_number}`")
        SrText(:text="`Clabe: ${account.CLABE}`")
      SrGridColumn(tag="li" :size="{mobile: '1'}")
        SrText(:text="paymentStepsText[1]")
    QuiviButton(href="/" label="Ir a la tienda")
</template>

<script lang="ts" setup>
const { order_id } = useRoute().query;
const promises = await Promise.all([
  $fetch("/api/content?page=_config/business"),
  $fetch("/api/content?page=_config/contact"),
]);
const { bank_accounts: accounts } = promises[0];
const { email: contactMail } = promises[1];
const paymentStepsText = [
  "Realiza la transferencia o deposito a alguna de estas cuentas: <br><small>(Usar número de orden como referencia de pago)</small>",
  `Envia un correo con tu <strong>número de orden</strong> en el <strong>asunto</strong> y el comprobante de pago a esta dirección: <strong>${contactMail}</strong>`,
];
</script>

<style lang="scss" scoped>
.checkout-spei {
  display: flex;
  min-height: 70vh;
  .sr-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    max-width: pxToRem(800);
    > * {
      margin-bottom: pxToRem(20);
    }
  }

  .spei-accounts {
    list-style: none;
    padding: 0;
    margin: 0;

    &-item {
      &:not(:last-child) {
        margin-bottom: pxToRem(20);
      }
    }
  }
}
</style>
