<template lang="pug">
UContainer
    div(v-if="verifyingPayment" class="col-span-12")
      p Verificando Pago...
    UPageGrid(v-else)
        div(class="col-span-1 sm:col-span-8" class="column")
          CheckoutSteps
          ClientOnly
            TransitionGroup(name="fade")
              CheckoutInfo(v-show="stepsState[0].active" :sat="sat.meta.content" key="1")
              CheckoutPayment(v-show="stepsState[1].active" key="2")
              CheckoutResume(v-show="stepsState[2].active" :sat="sat.meta.content" key="3")
                    
        div(class="col-span-1 sm:col-span-4")
          ClientOnly
              CartList(:products="cart.products" :editable="false")
              CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
          UButton(label="Pagar" :disabled="!paymentLock" kind="primary" @click="termsModalSw = true")
    UModal.terms-modal( v-model:open="termsModalSw")
      template(#title)
        p Para continuar acepta los términos y condiciones
      template(#body)
        Terms.mb-4(:terms="terms.meta.content.sections")
        UCheckbox(v-model="termsSw" label="Acepta los términos y condiciones para proceder al pago" class="check")
      template(#footer)
        p(v-html="termsLegend2")
        UButton(label="Pagar" @click="processPayment" :disabled="!termsSw" :loading="loadingPayment")
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
  syncData,
  clearCheckout,
} = useCheckout();

const { data } = await useAsyncData("checkout-config", async () => {
  const terms = await queryCollection("config")
    .where("stem", "=", "_config/terms")
    .first();
  const sat = await queryCollection("config")
    .where("stem", "=", "_config/sat")
    .first();

  return {
    terms,
    sat,
  };
});

const { terms, sat } = data.value as {
  terms: Object;
  sat: Object;
};

const termsLegend2: string =
  "Serás redirigido a un sitio externo a <span class='highlight'>Quivi.mx</span>";

const loadingPayment: Ref<boolean> = ref(false);
const verifyingPayment: Ref<Boolean> = ref(false);
const termsModalSw: Ref<Boolean> = ref(false);
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
  await navigateTo(
    `/tienda/order/barcode?order_id=${orderId}&reference=${reference}`,
  );
};

const speiHandler = async (orderId: string) => {
  const { order }: any = await proccesOrder(orderId);
  saveOrder(order);
  resetStorage();
  await navigateTo(`/tienda/order/spei?order_id=${order.order_no}`);
};

// Pre-register card payments so sales always exist before redirect
const cardPendingHandler = async (orderId: string, transactionId: string) => {
  const result: any = await proccesOrder(orderId, transactionId, false);
  if (result && result.order) {
    await saveOrder(result.order);
  }
};

const processPayment = async () => {
  if (termsSw.value) {
    termsModalSw.value = false;
  }
  loadingPayment.value = true;

  if (
    ["credit-card", "debit-card", "cash", "spei"].includes(
      paymentMethod.value.value,
    )
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
    if (paymentMethod.value.value === "cash") {
      openpay.pay(data, storePayment);
    } else if (paymentMethod.value.value === "spei") {
      openpay.pay(data, speiHandler);
    } else {
      // credit/debit card: pre-register, then redirect handled by Openpay
      openpay.pay(data, cardPendingHandler);
    }
  } else if (paymentMethod.value.value == "paypal") {
    const paypal = new paypalHandler();
    paypal.pay(cart.value.products, cart.value.total);
  }
};

const resetStorage = () => {
  clearCheckout();
  emptyCart();
};

const proccesOrder = async (
  id: string,
  transaction?: string,
  paid: boolean = false,
) => {
  const user = null;

  const partidas = cart.value.products.map(
    (product: any) => `${product.qty},${product.sae},${product.price}`,
  );

  const data: any = {
    transactionId,
    partidas,
    shippmentData: shipping.value,
    billSw: billingSw.value,
    paymentMethod: paymentKeyDict[(paymentMethod.value as any).value] || "",
    total: cart.value.total,
    user,
    order_id: id,
  };
  if (billingSw.value) {
    data.billing = billing.value;
  }

  try {
    const sae = await $fetch("/api/order/sae", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
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
      status: paid,
      shipping: shipping.value,
      payment: {
        method: paymentKeyDict[(paymentMethod.value as any).value] || "",
        transaction: transaction || "",
        status: paid,
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

const transactionHandler = async () => {
  if (transactionId) {
    verifyingPayment.value = true;
    const { status, payment_method, reference, barcode_url }: any =
      await $fetch("/api/payment/openpay/verify-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          transactionId,
        },
      });

    if (status === "completed") {
      verifyingPayment.value = false;

      try {
        // Update existing sale payment status if already pre-registered
        const updated: any = await $fetch("/api/sales/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            order_no: registeredOrder,
            status: true,
            payment: { status: true, transaction: transactionId },
          },
        }).catch(() => null);

        if (!updated) {
          // Fallback: create the order now if it wasn't pre-registered
          const { order }: any = await proccesOrder(
            registeredOrder as string,
            transactionId as string,
            true,
          );
          if (order) {
            await saveOrder(order);
          }
        }
        resetStorage();

        //if payment method is not cash redirect to success page
        if (payment_method.type !== "store") {
          await navigateTo(`/tienda/order/success?order_id=${registeredOrder}`);
        } else {
          //if payment method is cash redirect to barcode page
          await navigateTo(
            `/tienda/order/barcode?order_id=${registeredOrder}&reference=${reference}`,
          );
        }
      } catch (error: any) {
        throw new Error(error);
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
        true,
      );
      saveOrder(order);
      resetStorage();
      await navigateTo(`/tienda/order/success?order_id=${registeredOrder}`);
    }
  }
};

onMounted(() => {
  syncData();
  transactionHandler();
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
    backdrop-filter: blur(pxToRem(5));
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
