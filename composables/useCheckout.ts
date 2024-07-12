const shipping = ref<any>({
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

const billing = ref<any>({
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

const billingSw = ref<boolean>(false);
const billingAddressSw = ref<boolean>(false);
const paymentLock = ref<boolean>(false);

const stepsState = ref<any>([
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

const paymentMethod = ref<{ name: string; value: string }>({
  name: "",
  value: "",
});

const sat = await $fetch("/api/content?page=_config/sat");

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
    billingSw.value = data.billingSw;
    paymentMethod.value = data.paymentMethod;
  }
}

export function useCheckout() {
  function handlePayment(kind: string, data: any) {
    console.log(kind, data);
  }

  function setStep(step: number) {
    if (step - 1 >= 0) {
      stepsState.value[step - 1].done = true;
    }
    if (step + 1 < stepsState.value.length) {
      stepsState.value[step + 1].done = false;
    }
    stepsState.value[step].enabled = true;
    const current = stepsState.value.find((step: any) => step.active);
    current!.active = false;

    const newStep = stepsState.value[step];

    if (newStep.enabled) {
      newStep.active = true;
    }
  }

  return {
    billing,
    billingSw,
    billingAddressSw,
    handlePayment,
    paymentLock,
    paymentMethod,
    sat,
    setStep,
    shipping,
    stepsState: readonly(stepsState),
    syncData,
  };
}
