<template lang="pug">
.catalogo
    SrContainer(:with-padding="true")
        SrText(:text="`Order: ${order_id}`" class="title")
        SrText(:text="order.payment.transaction")
        SrText(:text="getPaymentMethod(order.payment.method)")
        SaleProducts(:products="order.products")

        SrGrid(:style="{marginTop: '0!important'}")
            SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
                Shipment(:shipment="order.shipment")
            SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
                Bill(:bill="order.bill" v-if="order.bill")

        QuiviButton(label="Ir a Tienda" href="/")

</template>

<script lang="ts" setup>
import { paymentKeyDict } from "assets/ts/utilities";
const { order_id } = useRoute().query;
const order = await $fetch(`/api/sales/${order_id}`);

const getPaymentMethod = (name: string) => {
  const r: any = Object.entries(paymentKeyDict).find(
    ([key, value]: [string, any]) => {
      return value == name ? key : null;
    },
  );
  return r[0].replace(/-/g, " ");
};
</script>

<style lang="scss" scoped>
.catalogo {
  .sr-container {
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(20);
      }
    }
  }
}
</style>
