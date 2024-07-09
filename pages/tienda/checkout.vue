<template lang="pug">
.checkout
    .checkout-loading(v-if="verifyingPayment")
        SrContainer
            SrText(text="Verificando Pago..." class="title" alignment="center")
    SrContainer(:with-padding="true")
        SrText(text="Checkout" class="title" alignment="center")

        SrGrid
            SrGridColumn(:size="{mobile: '1', sm: '3/4'}" class="column")
              CheckoutSteps(:steps="stepsState" @set-step="setStep")
              ClientOnly
                TransitionGroup(name="fade")
                  CheckoutInfo(v-show="stepsState[0].active" key="1" :sat="sat" :saleData="saleData" @save-info="setSaleData")
                  CheckoutPayment(v-show="stepsState[1].active" key="2" @save-payment="setPaymentData")
                  CheckoutResume(v-show="stepsState[2].active" :sat="sat" :shippmentData="saleData.shipping" :billing-sw="saleData.billSw" :billData="saleData.bill" :paymentMethod="paymentMethod" key="3")
                        
            SrGridColumn(:size="{mobile: '1', sm: '1/4'}")
              .cart-resume
                ClientOnly
                    CartList(:products="cart.products" :editable="false")
                    CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping")
                QuiviButton(label="Pagar" :disabled="!paymentLock" kind="primary" @buttonclick="termsModal.toggle()")
    SrModal(ref="termsModal" class="modal-terms")
        template(#body)
            QuiviTerms(:terms="terms" )
            .check
              SrFormBox( v-model="termsSw" type="checkbox")
              SrText(@click="termsSw = !termsSw" :html="termsLegend")
        template(#footer)
          SrText(text="Para continuar acepta los términos y condiciones")
          SrText(:html="termsLegend2")
          br
          QuiviButton(label="Pagar" @buttonclick="processPayment" :disabled="!termsSw")
</template>

<script lang="ts" setup>
import {
  toPrice,
  processDiscount,
  openpayHandler,
  paypalHandler,
  buildOrderId,
  paymentKeyDict,
} from "~/assets/ts/utilities";
import type { Cart } from "~/types";

const {
  id: transactionId,
  order_id: registeredOrder,
  token: paypal_order_id,
} = useRoute().query;

const cart: Ref<Cart> = useLocalStorage("cart", {
  products: [],
  total: 0,
  subtotal: 0,
  shipping: 0,
});

const saleData: Ref<any> = useLocalStorage("saleData", {
  shipping: {
    name: "",
    last_name: "",
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
  },
  bill: {
    name: "",
    phone: "",
    email: "",
    rfc: "",
    cfdi: "",
    regime: "",
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
  },
  billSw: false,
});

const paymentMethod: Ref<{ name: string; value: string }> = useLocalStorage(
  "paymentMethod",
  {
    name: "",
    value: "",
  },
);

const [sat, terms] = await Promise.all([
  $fetch("/api/content?page=_config/sat"),
  $fetch("/api/content?page=_config/terms"),
]);

const termsLegend: string =
  "Acepta los <span class='highlight'>términos y condiciones</span> para proceder al pago";
const termsLegend2: string =
  "Serás redirigido a un sitio externo a <span class='highlight'>Quivi.mx</span>";

const paymentLock: Ref<Boolean> = ref(false);
const verifyingPayment: Ref<Boolean> = ref(false);
const termsModalSw: Ref<Boolean> = ref(false);
const termsModal: Ref<any> = ref(null);
const termsSw: Ref<Boolean> = ref(false);

const stepsState = ref([
  {
    label: "Envío y facturacíon",
    enabled: true,
    active: true,
    done: false,
  },
  {
    label: "Información de pago",
    enabled: false,
    active: false,
    done: false,
  },
  {
    label: "Revisar Orden",
    enabled: false,
    active: false,
    done: false,
  },
]);

const resetData = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") {
      resetData(obj[key]);
    } else {
      obj[key] = "";
    }
  });
};

const setStep = (step: number) => {
  const current = stepsState.value.find((step) => step.active);
  current!.active = false;

  const newStep = stepsState.value[step];

  if (newStep.enabled) {
    newStep.active = true;
  }
};

const buildData = (data: any) => {
  const obj = {};

  const setKeys = (obj: any, key: string, value = "") => {
    const keys = key.split(".");
    if (keys.length === 1) {
      obj[key] = value;
    } else {
      obj[keys[0]] ? null : (obj[keys[0]] = {});
      keys.forEach((key2, i) => {
        if (i > 0) {
          setKeys(obj[keys[0]], key2, data[key]);
        }
      });
    }
  };

  Object.keys(data).forEach((key) => {
    setKeys(obj, key, data[key]);
  });

  return obj;
};

const setSaleData = (data: any) => {
  saleData.value = data;
  stepsState.value[0].done = true;
  stepsState.value[1].enabled = true;
  setStep(1);
};
const setPaymentData = (data: { name: string; value: string }) => {
  paymentMethod.value = data;
  stepsState.value[1].done = true;
  stepsState.value[2].enabled = true;
  setStep(2);
  paymentLock.value = true;
};

const saveOrder = async (order: any) => {
  const user = {};

  await $fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { ...order, user },
  });
};

const storePayment = async (orderId: string, reference: string) => {
  const { order }: any = await proccesOrder(orderId);
  saveOrder(order);
  resetStorage();
  useRouter().push(
    `/tienda/order/barcode?order_id=${orderId}&reference=${reference}`,
  );
};

const speiHandler = async () => {
  const orderId = buildOrderId();
  const { order }: any = await proccesOrder(orderId);
  saveOrder(order);
  resetStorage();
  useRouter().push(`/tienda/order/spei?order_id=${order.order_no}`);
};

const processPayment = async () => {
  if (termsSw.value) {
    termsModalSw.value = false;
  }
  if (
    ["credit-card", "debit-card", "cash"].includes(paymentMethod.value.value)
  ) {
    const data = {
      paymentMethod: paymentMethod.value,
      total: cart.value.total,
      shippmentData: saleData.value.shipping,
    };

    //TODO add payment plan (MSI)
    /*
      if all the products in the cart are available for MSI
      and the user selected the MSI option:
        availablePayments = [3, 6, 9, 12, 18];
        data.payment_plan = {
          payments: availablePayments[x];
        }
    */

    const openpay = new openpayHandler();
    openpay.pay(data, storePayment);
  } else if (paymentMethod.value.value == "paypal") {
    const paypal = new paypalHandler();
    paypal.pay(cart.value.products, cart.value.total);
  } else if (paymentMethod.value.value == "spei") {
    speiHandler();
  }
};

const resetStorage = () => {
  resetData(saleData.value);
  saleData.value.billSw = false;
  cart.value.products = [];
};

const proccesOrder = async (id: string, transaction?: string) => {
  const user = null;

  try {
    const sae = await $fetch("/api/order/sae", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        transactionId,
        partidas: cart.value.products.map((product: any) => {
          return `${product.qty},${product.sae},${product.price}`;
        }),
        shippmentData: saleData.value.shipping,
        billing: saleData.value.bill,
        billSw: saleData.value.billSw,
        paymentMethod: paymentKeyDict[(paymentMethod.value as any).value] || "",
        total: cart.value.total,
        user,
        order_id: id,
      },
    });

    const order: any = {
      user,
      products: cart.value.products.map((product: any) => ({
        product: product._id,
        quantity: product.qty,
        price: product.price,
        discount: product.discount,
      })),
      order_no: id,
      sae_order: sae ? sae : null,
      status: ["cash", "spei"].includes(paymentMethod.value.value as string)
        ? false
        : true,
      shipping: saleData.value.shipping,
      payment: {
        method: paymentKeyDict[(paymentMethod.value as any).value] || "",
        transaction: transaction || "",
        status: true,
        installments: 1,
      },
      discount: 0,
      total: cart.value.total,
    };

    if (saleData.value.billSw) {
      order.billing = saleData.value.bill;
    }

    return {
      order,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

if (transactionId) {
  verifyingPayment.value = true;
  const { status, payment_method, reference, barcode_url }: any = await $fetch(
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

    const { order }: any = await proccesOrder(
      registeredOrder as string,
      transactionId as string,
    );

    if (order) {
      saveOrder(order);
      resetStorage();
    }

    //if payment method is not cash redirect to success page
    if (payment_method.type !== "store") {
      useRouter().push(`/tienda/order/success?order_id=${registeredOrder}`);
    } else {
      //if payment method is cash redirect to barcode page
      console.log(barcode_url);
      useRouter().push(
        `/tienda/order/barcode?order_id=${registeredOrder}&reference=${reference}`,
      );
    }
  } else {
    //if not success, save order to unfinished orders.
  }
} else if (paypal_order_id) {
  //confirm paypal order
  const paypal = new paypalHandler();
  const confirm = await paypal.confirm(paypal_order_id as string);

  if (confirm === "APPROVED") {
    const { order }: any = await proccesOrder(
      registeredOrder as string,
      paypal_order_id as string,
    );
    saveOrder(order);
    resetStorage();
    useRouter().push(`/tienda/order/success?order_id=${registeredOrder}`);
  }
}
</script>

<style lang="scss">
.checkout {
  position: relative;
  min-height: 80vh;
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

  .cart-resume {
    position: sticky;
    top: pxToRem(40);
  }

  .quivi-cart {
    &-list {
      max-height: 40vh;
    }
    &-detail {
      .quivi-button {
        display: none;
      }
    }
  }

  .modal-terms {
    .sr-modal-container {
      overflow: hidden;
      max-width: pxToRem(800);
      max-height: 90vh;
    }
    .sr-modal-content {
      width: 100%;
      min-width: inherit;
    }

    .sr-modal-body {
      .quivi-terms {
        margin-bottom: pxToRem(20);
      }

      .check {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: pxToRem(20);
        .sr-text {
          font-size: pxToRem(12);
        }
        .sr-form-box {
          margin-top: pxToRem(4);
          font-size: pxToRem(12);
          &-label {
            width: auto;
          }
        }
      }
    }

    .sr-modal-footer {
      .sr-text {
        &-container {
          text-align: center;
          font-size: pxToRem(12);
        }
        &:last-of-type {
          margin-bottom: pxToRem(20);
        }
      }
    }
  }
}
</style>
