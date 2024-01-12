<template lang="pug">
.shipping-form
    SrFormInput(label="Nombre" :value="shippmentData.name" @updated="shippmentData.name = $event.value")
    SrFormInput(label="Email" type="email" :value="shippmentData.email" @updated="shippmentData.email = $event.value")
    SrFormInput(label="Telefono" :value="shippmentData.phone" @updated="shippmentData.phone = $event.value")
    SrFormInput(label="Calle" :value="shippmentData.address.street" @updated="shippmentData.address.street = $event.value")
    SrFormInput(label="Numero exterior" :value="shippmentData.address.ext_num" @updated="shippmentData.address.ext_num = $event.value")
    SrFormInput(label="Numero interior" :value="shippmentData.address.int_num" @updated="shippmentData.address.int_num = $event.value")
    SrFormInput(label="Colonia" :value="shippmentData.address.neighborhood" @updated="shippmentData.address.neighborhood = $event.value")
    SrFormInput(label="Ciudad" :value="shippmentData.address.city" @updated="shippmentData.address.city = $event.value")
    SrFormInput(label="Estado" :value="shippmentData.address.state" @updated="shippmentData.address.state = $event.value")
    SrFormInput(label="Pais" :value="shippmentData.address.country" @updated="shippmentData.address.country = $event.value")
    SrFormInput(label="Codigo postal" :value="shippmentData.address.zip" @updated="shippmentData.address.zip = $event.value")
    button(@click="$emit('save-shipping', shippmentData)") save Shipping
</template>

<script lang="ts" setup>
const shippmentData = ref({
  name: "",
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
</script>
