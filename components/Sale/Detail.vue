<script lang="ts" setup>
import { getInvertedKey } from "~/assets/ts/utilities";

defineProps({
  sale: {
    type: Object,
    default: () => ({
      order_no: "",
    }),
  },
});
</script>

<template lang="pug">
section.sale-detail
  SrText(:text="`Order: ${sale.order_no}`" class="title")
  SrText(:text="`Metodo de pago: ${getInvertedKey(sale.payment.method)}`" class="subtitle")
  
  template(v-if="sale.payment.method === 'EFE'")
    SrFormInput(label="No. de Transaccion" v-model="sale.payment.transaction")
    button(type="button" @click="console.log('aprove order')") Autorizar
    
  SrGrid
    SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
      SrText(:text="`Sae: ${sale.sae_order}`" class="subtitle")
    SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
      Status(:status="sale.status ? 2 : 0")
          SrText(text="status" class="subtitle")

  SaleProducts(:products="sale.products")

  SrGrid
    SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
      Shipment(:shipment="sale.shipment")
    SrGridColumn(:size="{mobile: '1', sm: '1/2'}" v-if="sale.bill")
      Bill(:bill="sale.bill")


</template>

<style lang="scss">
.sale-detail {
  > * {
    &:not(:last-child) {
      margin-bottom: pxToRem(20);
    }
  }
}
</style>
