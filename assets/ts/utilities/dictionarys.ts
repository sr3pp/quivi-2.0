export const paymentKeyDict: any = {
  "credit-card": "TRC",
  "debit-card": "TRD",
  paypal: "PYP",
  spei: "TRN",
  cash: "EFE",
};

export const getInvertedKey = (k: string) => {
  const method: any = Object.entries(paymentKeyDict).find(([key, value]) =>
    k === value ? key : null,
  );
  return method[0];
};
