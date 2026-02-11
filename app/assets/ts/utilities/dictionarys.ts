import type { PaymentCode, PaymentMethodKey } from "~/types";

export const paymentKeyDict: Record<PaymentMethodKey, PaymentCode> = {
  "credit-card": "TRC",
  "debit-card": "TRD",
  paypal: "PYP",
  spei: "TRN",
  cash: "EFE",
};

export const getInvertedKey = (k: PaymentCode): PaymentMethodKey => {
  const method = Object.entries(paymentKeyDict).find(([, value]) =>
    k === value ? true : false,
  );
  return (method?.[0] as PaymentMethodKey) || "cash";
};
