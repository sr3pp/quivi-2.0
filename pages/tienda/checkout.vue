<template lang="pug">
.checkout
    .checkout-loading(v-if="verifyingPayment")
        SrContainer
            SrText(value="Verificando Pago..." kind="title" alignment="center")
    SrContainer(:with_space="true")
        SrText(value="Checkout" kind="title" alignment="center")
        SrGrid
            .sr-grid-col-1(class="sm:sr-grid-col-3/4 column")
                Accordion(label="Información de envío" :active="currentStep == 1" @toogle="currentStep == 1 ? currentStep = 0 : currentStep = 1")
                    template(#content)
                        ShippingForm(@save-shipping="setShippmentData")
                        SrFormBox(kind="checkbox" label="Requiero Factura" :checked="billingSw" @updated="billingSw = !billingSw")
                        BillingForm(v-if="billingSw" :shippingAddress="shippmentData.address")
                        SrFormBox(kind="checkbox" label="Usar direccion de envio" :checked="billingAddressSw" @updated="billingAddressSw = !billingAddressSw")
                Accordion(label="Información de pago" :active="currentStep == 2" @toogle="currentStep == 2 ? currentStep = 0 : currentStep = 2")
                    template(#content)
                        SrFormSelect(:options="paymentOptions" value="card" label="Método de pago")
                Accordion(label="Resumen" :active="currentStep == 3" @toogle="currentStep == 3 ? currentStep = 0 : currentStep = 3")
                    template(#content)
                        SrGrid
                            .sr-grid-col-1(class="sm:sr-grid-col-1/2 column")
                                SrText(value="Datos de Envio" kind="subtitle")
                                
                            .sr-grid-col-1(class="sm:sr-grid-col-1/2 column")
                                SrText(value="Datos de pago" kind="subtitle")
            .sr-grid-col-1(class="sm:sr-grid-col-1/4 column")
                ClientOnly
                    CartList(:products="cart.products" :editable="false")
                    CartTotal(:total="cart.total")
                Button(label="Pagar" :disabled="paymentLock" kind="primary" @buttonclick="processPamyment")
                
</template>

<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";
const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
});

const transactionId = useRoute().query.id;

const verifyingPayment = ref(false);

if (transactionId) {
  verifyingPayment.value = true;
  const { status }: any = await $fetch(
    "/api/payment/openpay/verify-transaction",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        transactionId,
      },
    },
  );

  if (status === "completed") {
    verifyingPayment.value = false;
    const sae = await $fetch("/api/order/sae", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        transactionId,
      },
    });
    console.log("sae", sae);

    const order = {
      user: null,
      products: cart.value.products.map((product: any) => ({
        product: product._id,
        quantity: product.qty,
        price: product.price,
        discount: product.discount,
      })),
      order_no: "",
      sae_order: sae,
      status: true,
      shipping: shippmentData.value,
      payment: {
        method: "card",
        transaction: transactionId,
        status: true,
        installments: 1,
      },
      discount: 0,
      total: cart.value.total,
      billData: billData.value,
    };

    useRouter().push("/tienda/");
    //add sae number to order obj
    //save order in db;
  } else {
    //if not success, save order to unfinished orders.
  }
}

const shippmentData = ref({
  name: "",
  email: "",
  phone: "",
  address: {
    street: "",
    ext_num: "",
    int_num: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  },
});

const setShippmentData = (data: any) => {
  shippmentData.value = data;
  console.log(data);
};

const billingSw = ref(false);
const billingAddressSw = ref(false);
const paymentLock = ref(false);
const currentStep = ref(1);

const paymentOptions = [
  { value: "credit-card", name: "Tarjeta de crédito" },
  { value: "debit-card", name: "Tarjeta de débito" },
  { value: "paypal", name: "Paypal" },
  { value: "spei", name: "Transferencia / Deposito" },
  { value: "cash", name: "Efectivo" },
];

const processPamyment = async () => {
  const response = await $fetch("/api/payment/openpay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      method: "card", // switch to store if cash
      amount: 100,
      description: "Cargo inicial a mi cuenta",
      order_id: "loid-00052",
      customer: {
        name: "Juan",
        last_name: "Vazquez Juarez",
        phone_number: "4423456723",
        email: "juan.vazquez@empresa.com.mx",
      },
      confirm: "false",
      send_email: "false",
      redirect_url: "/tienda/checkout",
    },
  });

  const { payment_method, status, id }: any = response;

  if (payment_method.url) {
    window.location.href = payment_method.url;
  }
};
</script>

<style lang="scss" scoped>
.checkout {
  position: relative;
  &-loading {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 3;
    background-color: rgba($color-white, 0.5);
    backdrop-filter: blur(unit(5));
    display: flex;
    align-items: center;
  }
}
</style>
