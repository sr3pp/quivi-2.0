<template lang="pug">
.quivi-checkout-payment
  USelect(:items="paymentOptions" v-model="method" label="Método de pago" placeholder="Selecciona un Metodo de pago")
  br
  UButton(label="Continuar" @click="setPaymentMethod(method)" :disabled="!method")
</template>

<script lang="ts" setup>
import type { PaymentOption } from "~/types";

const paymentOptions: Array<{ value: PaymentOption["value"]; label: string }> =
  [
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
  const selected = paymentOptions.find((el) => el.value == method);
  if (!selected) return;
  paymentMethod.value = {
    name: selected.label,
    value: selected.value,
  };
  paymentLock.value = true;
  setStep(2);
};
</script>

<style lang="scss"></style>
