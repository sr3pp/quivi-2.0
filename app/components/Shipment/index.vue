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
  h2 Shipment
  p {{`tracking: ${shipment.tracking}`}}
  p {{`name: ${shipment.name} ${shipment.last_name}`}}
  p {{`tel: ${shipment.phone}`}}
  p {{`email: ${shipment.email}`}}
  p {{`cost: ${toPrice(shipment.cost)}`}}
  br
  UBadge(:color="shipment.status == 'delivered' ? 'primary' : shipment.status == 'shipping' ? 'warning' : 'error'" :label="`Envio: ${shipment.status}`")
  br
  Address(:address="shipment.address")

</template>