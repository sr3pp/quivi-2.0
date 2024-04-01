<template lang="pug">
.quivi-checkout-payment
  SrFormSelect(:options="paymentOptions" v-model="method" label="Método de pago")
  br
  QuiviButton(label="Continuar" @click="method ? $emit('save-payment', paymentOptions.find(el => el.value == method)) : null")
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

const method = ref(paymentOptions[0].value);
</script>

<style lang="scss"></style>
