<template lang="pug">
div(class="relative min-h-[80vh]")
  UContainer.py-10
    div(
      v-if="verifyingPayment"
      class="fixed inset-0 z-[3] flex items-center justify-center bg-[rgba(255,255,255,0.5)] backdrop-blur-[5px]"
    )
      p Verificando Pago...
    UPageGrid(v-else)
        div(class="col-span-1 sm:col-span-8" class="column")
          CheckoutSteps
          ClientOnly
            TransitionGroup(name="fade")
              CheckoutInfo(v-show="stepsState[0].active" :sat="satContent" key="1")
              CheckoutPayment(v-show="stepsState[1].active" key="2")
              CheckoutResume(v-show="stepsState[2].active" :sat="satContent" key="3")
                    
        div(class="col-span-1 sm:col-span-4 sticky top-10 flex flex-col justify-center gap-5")
          ClientOnly
              CartList(:products="cart.products" :editable="false" class="[&_ul]:max-h-[40vh]")
              CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
          UButton(label="Pagar" :disabled="!paymentLock" kind="primary" @click="termsModalSw = true")
    UModal(v-model:open="termsModalSw")
      template(#title)
        p Para continuar acepta los términos y condiciones
      template(#body)
        Terms.mb-4(:terms="termsSections")
        UCheckbox(v-model="termsSw" label="Acepta los términos y condiciones para proceder al pago" class="mb-5 flex items-center justify-center text-xs")
      template(#footer)
        p(class="mb-5 text-center text-xs" v-html="termsLegend2")
        UButton(class="mx-auto" label="Pagar" @click="processPayment" :disabled="!termsSw" :loading="loadingPayment")
</template>

<script lang="ts" setup>
import {
  openpayHandler,
  paypalHandler,
  paymentKeyDict,
} from "~/assets/ts/utilities";
import type { LocationQueryValue } from "vue-router";
import type {
  CheckoutCartProduct,
  OpenpayVerificationResponse,
  PaymentCode,
  SaleOrderDraft,
} from "~/types";

const {
  id: routeTransactionId,
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

const termsSections = computed<unknown[]>(() => {
  const sections = (data.value?.terms as { meta?: { content?: { sections?: unknown[] } } } | null)?.meta?.content?.sections;
  return Array.isArray(sections) ? sections : [];
});

const satContent = computed<Record<string, unknown>>(() => {
  const content = (data.value?.sat as { meta?: { content?: Record<string, unknown> } } | null)?.meta?.content;
  return content ?? {};
});

const normalizeQueryValue = (
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (value === null) {
    return undefined;
  }
  return value;
};

const asString = (
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === "string");
  }
  return undefined;
};

const transactionId = normalizeQueryValue(routeTransactionId);
const registeredOrderId = asString(registeredOrder);
const paypalOrderId = asString(paypal_order_id);

const termsLegend2: string =
  "Serás redirigido a un sitio externo a <span class='highlight'>Quivi.mx</span>";

const loadingPayment: Ref<boolean> = ref(false);
const verifyingPayment: Ref<boolean> = ref(false);
const termsModalSw: Ref<boolean> = ref(false);
const termsSw: Ref<boolean> = ref(false);

const saveOrder = async (order: SaleOrderDraft) => {
  const user = {} as Record<string, never>;

  await $fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { ...order, user },
  });
};

const storePayment = async (orderId: string, reference?: string) => {
  const result = await proccesOrder(orderId);
  const order = result?.order;
  if (!order) return;
  await saveOrder(order);
  resetStorage();
  await navigateTo(
    `/tienda/order/barcode?order_id=${orderId}&reference=${reference ?? ""}`,
  );
};

const speiHandler = async (orderId: string) => {
  const result = await proccesOrder(orderId);
  const order = result?.order;
  if (!order) return;
  await saveOrder(order);
  resetStorage();
  await navigateTo(`/tienda/order/spei?order_id=${order.order_no}`);
};

// Pre-register card payments so sales always exist before redirect
const cardPendingHandler = async (orderId: string, transactionId?: string) => {
  const result = await proccesOrder(orderId, transactionId ?? "", false);
  if (result && result.order) {
    await saveOrder(result.order);
  }
};

const processPayment = async () => {
  try {
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
        await openpay.pay(data, storePayment);
      } else if (paymentMethod.value.value === "spei") {
        await openpay.pay(data, speiHandler);
      } else {
        // credit/debit card: pre-register, then redirect handled by Openpay
        await openpay.pay(data, cardPendingHandler);
      }
    } else if (paymentMethod.value.value == "paypal") {
      const paypal = new paypalHandler();
      await paypal.pay(cart.value.products, cart.value.total);
    }
  } catch (error) {
    console.error("Payment processing failed", error);
  } finally {
    loadingPayment.value = false;
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
): Promise<{ order: SaleOrderDraft } | null> => {
  const user = null;

  const cartProducts = cart.value.products as CheckoutCartProduct[];
  const partidas = cartProducts.map(
    (product) =>
      `${Number(product.qty ?? 0)},${String(product.sae)},${Number(product.price)}`,
  );

  const paymentMethodCode: PaymentCode | "" = paymentMethod.value.value
    ? paymentKeyDict[paymentMethod.value.value]
    : "";

  const data: {
    transactionId: string | string[] | undefined;
    partidas: string[];
    shippmentData: unknown;
    billSw: boolean;
    paymentMethod: PaymentCode | "";
    total: number;
    user: null;
    order_id: string;
    billing?: unknown;
  } = {
    transactionId,
    partidas,
    shippmentData: shipping.value,
    billSw: billingSw.value,
    paymentMethod: paymentMethodCode,
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

    const order: SaleOrderDraft = {
      user,
      products: cartProducts.map((product) => ({
        product: String(product._id),
        quantity: Number(product.qty ?? 0),
        price: Number(product.price),
        discount: Number(product.discount),
      })),
      order_no: id,
      sae_order: sae ? String(sae) : null,
      status: paid,
      shipping: shipping.value,
      payment: {
        method: paymentMethodCode,
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
    return null;
  }
};

const transactionHandler = async () => {
  if (transactionId) {
    verifyingPayment.value = true;
    const { status, payment_method, reference }: OpenpayVerificationResponse =
      await $fetch<OpenpayVerificationResponse>(
        "/api/payment/openpay/verify-transaction" as string,
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

      try {
        // Update existing sale payment status if already pre-registered
        const updated = await $fetch("/api/sales/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            order_no: registeredOrderId,
            status: true,
            payment: { status: true, transaction: asString(transactionId) ?? "" },
          },
        }).catch(() => null);

        if (!updated) {
          // Only fallback when there is no existing sale for this order id.
          const existingSale = await $fetch(
            `/api/sales/${String(registeredOrderId ?? "")}` as string,
          ).catch(
            () => null,
          );

          if (!existingSale) {
            const result = await proccesOrder(
              registeredOrderId ?? "",
              asString(transactionId) ?? "",
              true,
            );
            const order = result?.order;
            if (order) {
              await saveOrder(order);
            }
          }
        }
        resetStorage();

        //if payment method is not cash redirect to success page
        if (payment_method.type !== "store") {
          await navigateTo(`/tienda/order/success?order_id=${registeredOrderId ?? ""}`);
        } else {
          //if payment method is cash redirect to barcode page
          await navigateTo(
            `/tienda/order/barcode?order_id=${registeredOrderId ?? ""}&reference=${reference ?? ""}`,
          );
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
      }
    } else {
      //if not success, save order to unfinished orders.
    }
  } else if (paypalOrderId) {
    //confirm paypal order
    const paypal = new paypalHandler();
    const confirm = await paypal.confirm(paypalOrderId);

    if (confirm === "APPROVED") {
      const result = await proccesOrder(
        registeredOrderId ?? "",
        paypalOrderId,
        true,
      );
      const order = result?.order;
      if (!order) return;
      await saveOrder(order);
      resetStorage();
      await navigateTo(`/tienda/order/success?order_id=${registeredOrderId ?? ""}`);
    }
  }
};

onMounted(() => {
  syncData();
  transactionHandler();
});
</script>
