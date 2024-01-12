<template lang="pug">
.billing-form
    SrFormInput(label="Nombre" :value="billData.name")
    SrFormInput(label="cfdi" :value="billData.cfdi")
    SrFormInput(label="RFC" :value="billData.rfc")
    SrFormInput(label="phone" :value="billData.phone")
    SrFormInput(label="email" type="email" :value="billData.email")
    SrFormInput(label="Regimen" :value="billData.regime")
    SrFormBox(kind="checkbox" label="Usar direccion de envio" :checked="billData.use_shipment_address_checkbox" @updated="toggleAddress")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Calle" :value="billData.address.street")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Numero exterior" :value="billData.address.ext_num")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Numero interior" :value="billData.address.int_num")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Colonia" :value="billData.address.neighborhood")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Ciudad" :value="billData.address.city")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Estado" :value="billData.address.state")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Pais" :value="billData.address.country")
    SrFormInput(:disabled="billData.use_shipment_address_checkbox" label="Codigo postal" :value="billData.address.zip")
</template>

<script lang="ts" setup>
const props = defineProps({
  shippingAddress: {
    type: Object,
    default: () => ({}),
  },
});
const billData: any = ref({
  name: "",
  cfdi: "",
  rfc: "",
  phone: "",
  email: "",
  regime: "",
  status: false,
  use_shipment_address_checkbox: false,
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

const toggleAddress = () => {
  billData.value.use_shipment_address_checkbox =
    !billData.value.use_shipment_address_checkbox;

  if (billData.value.use_shipment_address_checkbox) {
    billData.value.address = props.shippingAddress;
  }
};
</script>
