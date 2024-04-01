import type shipment from '~/server/api/order/shipment';
<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";
defineProps({
  shipment: {
    type: Object,
    default: () => ({
      name: "",
      last_name: "",
      phone: "",
      email: "",
      tracking: "",
      status: "",
      cost: 0,
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
.shipment
  SrText(text="Shipment" class="subtitle" tag="h2")
  SrText(:text="`tracking: ${shipment.tracking}`" tag="h3")
  SrText(:text="`name: ${shipment.name} ${shipment.last_name}`")
  SrText(:text="`tel: ${shipment.phone}`")
  SrText(:text="`email: ${shipment.email}`")
  SrText(:text="`cost: ${toPrice(shipment.cost)}`")
  br
  Status(:status="shipment.status == 'delivered' ? 2 : shipment.status == 'shipping' ? 1 : 0")
    SrText(:text="`Envio: ${shipment.status}`")
  br
  Address(:address="shipment.address")

</template>

<style lang="scss">
.shipment {
  .sr-text {
    &.subtitle {
      margin-bottom: pxToRem(10);
    }
  }

  .status {
    justify-content: flex-start;
  }
}
</style>
