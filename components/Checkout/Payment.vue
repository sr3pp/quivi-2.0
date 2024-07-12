<template lang="pug">
.quivi-checkout-payment
  SrFormSelect(:options="paymentOptions" v-model="method" label="Método de pago")
  br
  QuiviButton(label="Continuar" @click="setPaymentMethod(method)")
</template>

<script lang="ts" setup>
const paymentOptions = [
  { value: "", name: "Selecciona un Metodo de pago" },
  { value: "credit-card", name: "Tarjeta de crédito" },
  { value: "debit-card", name: "Tarjeta de débito" },
  { value: "paypal", name: "Paypal" },
  { value: "spei", name: "Transferencia / Deposito" },
  { value: "cash", name: "Efectivo" },
];

const { paymentMethod, setStep, paymentLock } = useCheckout();
const method = ref(paymentMethod.value.value);
const setPaymentMethod = (method: string) => {
  (paymentMethod.value as any) = paymentOptions.find(
    (el) => el.value == method,
  );
  paymentLock.value = true;
  setStep(2);
};
</script>

<style lang="scss"></style>
