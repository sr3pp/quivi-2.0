<template lang="pug">
.checkout
    SrContainer(:with_space="true")
        SrText(value="Checkout" kind="title" alignment="center")
        SrGrid
            .sr-grid-col-1(class="sm:sr-grid-col-3/4 column")
                Accordion(label="Información de envío" :active="currentStep == 1" @toogle="currentStep == 1 ? currentStep = 0 : currentStep = 1")
                    template(#content)
                        SrForm(:form="shipForm")
                Accordion(label="Información de pago" :active="currentStep == 2" @toogle="currentStep == 2 ? currentStep = 0 : currentStep = 2")
                    template(#content)
                        SrFormSelect(:options="paymentOptions" value="card" label="Método de pago")
                        SrFormBox(kind="checkbox" label="Requiero Factura" :checked="billingSw" @updated="billingSw = !billingSw")
                        SrForm(:form="billingForm" v-if="billingSw")
            .sr-grid-col-1(class="sm:sr-grid-col-1/4 column")
                ClientOnly
                    CartList(:products="cart.products" :editable="false")
                    CartTotal(:total="cart.total")
                Button(label="Pagar" :disabled="paymentLock" kind="primary" @click="processPamyment")
                
</template>

<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
});

const billingSw = ref(false);
const paymentLock = ref(true);
const currentStep = ref(1);

const shipForm = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
});

const paymentOptions = [
  { value: "card", name: "Tarjeta de crédito / débito" },
  { value: "cash", name: "Efectivo" },
  { value: "spei", name: "Transferencia Electronica" },
  { value: "paypal", name: "Paypal" },
];

const billingForm = ref({
  name: "",
  rfc: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
});

const processPamyment = () => {
  console.log("payent logic here");
};
</script>

<style lang="scss" scoped></style>
