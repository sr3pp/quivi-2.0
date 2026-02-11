<template lang="pug">
.quivi-checkout-payment
  USelect(:items="paymentOptions" v-model="method" label="Método de pago" placeholder="Selecciona un Metodo de pago")
  br
  UButton(label="Continuar" @click="setPaymentMethod(method)" :disabled="!method")
</template>

<script lang="ts" setup>
const paymentOptions = [
  { value: "credit-card", label: "Tarjeta de crédito" },
  { value: "debit-card", label: "Tarjeta de débito" },
  { value: "paypal", label: "Paypal" },
  { value: "spei", label: "Transferencia / Deposito" },
  { value: "cash", label: "Efectivo" },
];

const { paymentMethod, setStep, paymentLock } = useCheckout();
const method = ref(paymentMethod.value?.value || "");
const setPaymentMethod = (method: string) => {
  if (!method) return;
  (paymentMethod.value as any) = paymentOptions.find(
    (el) => el.value == method,
  );
  paymentLock.value = true;
  setStep(2);
};
</script>

<style lang="scss"></style>
