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
  p Bill
  p {{ `Razon social: ${bill.name}` }}
  p {{ `Regimen: ${bill.regime}` }}
  p {{ `CFDI: ${bill.cfdi}` }}
  p {{ `RFC: ${bill.rfc}` }}
  p {{ `Tel: ${bill.phone}` }}
  p {{ `Email: ${bill.email}` }}
  br
  Address(:address="bill.address")
</template>
