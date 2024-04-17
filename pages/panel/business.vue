<template lang="pug">
.business
  SrContainer(:with-padding="true")
    SrText(text="Panel Bussines" class="title")

    SrText(text="Direccion" class="subtitle")
    SrForm(:fieldsets="addressForm")

    SrText(text="Cuentas Bancarias" class="subtitle")
    ul
      li(v-for="(value, key) in business.bank_accounts" :key="key")
        SrText(:text="`${value.bank_name} - ${value.account_number}`")

    SrText(text="Redes Sociales" class="subtitle")
    ul
      li(v-for="(value, key) in business.social" :key="key")
        SrText(:text="`${value.label} - ${value.url}`")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const addressForm = ref([
  {
    fields: [
      {
        component: "SrFormInput",
        props: {
          label: "Calle",
          name: "street",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "No. Exterior",
          name: "ext_number",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "No. Interior",
          name: "int_number",
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Colonia",
          name: "neighborhood",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Codigo Postal",
          name: "zip",
          required: true,
        },
      },
    ],
  },
]);

const business = await $fetch("/api/content?page=_config/business");
console.log("business", business);
const updateBusiness = () => {
  console.log("updateBusiness");
};
</script>

<style lang="scss" scoped>
.business {
}
</style>
