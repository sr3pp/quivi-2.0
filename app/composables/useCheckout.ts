import type {
  BillData,
  CheckoutStep,
  PaymentOption,
  ShipmentData,
} from "~/types";

const defaultShipping = (): ShipmentData => ({
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
});

const defaultBilling = (): BillData => ({
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
});

const defaultSteps = (): CheckoutStep[] => [
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
];

const shipping = ref<ShipmentData>(defaultShipping());
const billing = ref<BillData>(defaultBilling());

const billingSw = ref<boolean>(false);
const billingAddressSw = ref<boolean>(false);
const paymentLock = ref<boolean>(false);

const stepsState = ref<CheckoutStep[]>(defaultSteps());

const paymentMethod = ref<PaymentOption>({
  name: "",
  value: "",
});

watch(shipping, () => {
  if (process.client) {
    syncLocalStorage();
  }
});

watch(billing, () => {
  if (process.client) {
    syncLocalStorage();
  }
});

watch(billingSw, () => {
  if (process.client) {
    syncLocalStorage();
  }
});

watch(billingAddressSw, () => {
  if (process.client) {
    syncLocalStorage();
  }
});

watch(paymentMethod, () => {
  if (process.client) {
    syncLocalStorage();
  }
});

function syncLocalStorage() {
  if (process.client) {
    localStorage.setItem(
      "sale-data",
      JSON.stringify({
        shipping: shipping.value,
        billing: billing.value,
        billingSw: billingSw.value,
        billingAddressSw: billingAddressSw.value,
        paymentMethod: paymentMethod.value,
      }),
    );
  }
}

function syncData(): void {
  if (process.client) {
    const saleData = localStorage.getItem("sale-data");
    if (!saleData) return;
    const data = JSON.parse(saleData);
    shipping.value = data.shipping;
    billing.value = data.billing;
    billingSw.value = Boolean(data.billingSw);
    billingAddressSw.value = Boolean(data.billingAddressSw);
    paymentMethod.value = data.paymentMethod ?? { name: "", value: "" };
    paymentLock.value = Boolean(paymentMethod.value?.value);
  }
}

export function useCheckout() {
  function setStep(step: number) {
    const steps = stepsState.value;
    if (step < 0 || step >= steps.length) return;

    const prevStep = steps[step - 1];
    if (prevStep) {
      prevStep.done = true;
    }

    const nextStep = steps[step + 1];
    if (nextStep) {
      nextStep.done = false;
    }

    const targetStep = steps[step];
    if (!targetStep) return;
    targetStep.enabled = true;

    const currentStep = steps.find((activeStep) => activeStep.active);
    if (currentStep) {
      currentStep.active = false;
    }

    if (targetStep.enabled) {
      targetStep.active = true;
    }
  }

  function clearCheckout() {
    shipping.value = defaultShipping();
    billing.value = defaultBilling();
    billingSw.value = false;
    billingAddressSw.value = false;
    paymentLock.value = false;
    paymentMethod.value = { name: "", value: "" };
    stepsState.value = defaultSteps();
    syncLocalStorage();
  }

  return {
    billing,
    billingSw,
    billingAddressSw,
    paymentLock,
    paymentMethod,
    setStep,
    shipping,
    stepsState: readonly(stepsState),
    syncData,
    clearCheckout,
  };
}
