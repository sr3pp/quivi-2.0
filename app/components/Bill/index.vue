import type { SrText } from '#build/components';
<script lang="ts" setup>
defineProps({
  bill: {
    type: Object,
    default: () => ({
      name: "",
      cfdi: "",
      rfc: "",
      phone: "",
      email: "",
      regime: "",
      status: false,
      address: {
        street: "",
        ext_num: "",
        int_num: "",
        neighborhood: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      },
    }),
  },
});
</script>

<template lang="pug">
.bill
  SrText(text="Bill" class="subtitle" tag="h2")
  SrText(:text="`Razon social: ${bill.name}`")
  SrText(:text="`Regimen: ${bill.regime}`")
  SrText(:text="`CFDI: ${bill.cfdi}`")
  SrText(:text="`RFC: ${bill.rfc}`")
  SrText(:text="`Tel: ${bill.phone}`")
  SrText(:text="`Email: ${bill.email}`")
  br
  Address(:address="bill.address")
</template>

<style lang="scss">
.bill {
  .sr-text {
    &.subtitle {
      margin-bottom: pxToRem(10);
    }
  }
}
</style>
