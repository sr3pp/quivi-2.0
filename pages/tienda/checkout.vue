<template lang="pug">
.checkout
    .checkout-loading(v-if="verifyingPayment")
        SrContainer
            SrText(text="Verificando Pago..." class="title" alignment="center")
    SrContainer(:with-padding="true")
        SrText(text="Checkout" class="title" alignment="center")

        SrGrid
            SrGridColumn(:size="{mobile: '1', sm: '3/4'}" class="column")
              CheckoutSteps
              ClientOnly
                TransitionGroup(name="fade")
                  CheckoutInfo(v-show="stepsState[0].active" key="1")
                  CheckoutPayment(v-show="stepsState[1].active" key="2")
                  CheckoutResume(v-show="stepsState[2].active" key="3")
                        
            SrGridColumn(:size="{mobile: '1', sm: '1/4'}")
              .cart-resume
                ClientOnly
                    CartList(:products="cart.products" :editable="false")
                    CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
                QuiviButton(label="Pagar" :disabled="!paymentLock" kind="primary" @click="termsModal.toggle()")
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
          QuiviButton(label="Pagar" @click="processPayment" :disabled="!termsSw" :loading="loadingPayment")
</template>

<script lang="ts" setup>
import {
  openpayHandler,
  paypalHandler,
  buildOrderId,
  paymentKeyDict,
} from "~/assets/ts/utilities";

const {
  id: transactionId,
  order_id: registeredOrder,
  token: paypal_order_id,
} = useRoute().query;

const { cart, totalCartProducts, emptyCart } = useCart();

const {
  shipping,
  billing,
  billingSw,
  paymentMethod,
  stepsState,
  paymentLock,
  sat,
  syncData,
  clearCheckout,
} = useCheckout();

const [terms] = await Promise.all([$fetch("/api/content?page=_config/terms")]);

const termsLegend: string =
  "Acepta los <span class='highlight'>términos y condiciones</span> para proceder al pago";
const termsLegend2: string =
  "Serás redirigido a un sitio externo a <span class='highlight'>Quivi.mx</span>";

const loadingPayment: Ref<boolean> = ref(false);
const verifyingPayment: Ref<Boolean> = ref(false);
const termsModalSw: Ref<Boolean> = ref(false);
const termsModal: Ref<any> = ref(null);
const termsSw: Ref<Boolean> = ref(false);

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
  loadingPayment.value = true;

  if (
    ["credit-card", "debit-card", "cash"].includes(paymentMethod.value.value)
  ) {
    const data = {
      paymentMethod: paymentMethod.value,
      total: cart.value.total,
      shippmentData: shipping.value,
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
  clearCheckout();
  emptyCart();
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
        shippmentData: shipping.value,
        billing: billing.value,
        billSw: billingSw.value,
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
      shipping: shipping.value,
      payment: {
        method: paymentKeyDict[(paymentMethod.value as any).value] || "",
        transaction: transaction || "",
        status: true,
        installments: 1,
      },
      discount: 0,
      total: cart.value.total,
    };

    if (billingSw.value) {
      order.billing = billing.value;
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

onMounted(() => {
  syncData();
});
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
    display: flex;
    flex-direction: column;
    gap: pxToRem(20);
    justify-content: center;
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
      display: flex;
      flex-direction: column;
      .sr-text {
        &-container {
          text-align: center;
          font-size: pxToRem(12);
        }
        &:last-of-type {
          margin-bottom: pxToRem(20);
        }
      }
      .quivi-button {
        margin: auto;
      }
    }
  }
}
</style>
