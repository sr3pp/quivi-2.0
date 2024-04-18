<template lang="pug">
.quivi-business
  SrContainer(:with-padding="true")
    SrGrid.quivi-business-header
      SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
        SrText(text="Panel Bussines" class="title")
      SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
        QuiviButton(@click="updateBusiness" class="sr-button--primary" variant="secondary" label="Guardar cambios")
    SrText(text="Direccion" class="subtitle")
    ul.data-list.wrapped
      li.data-list-item(v-for="(value, key) in business.address" :key="key")
        SrFormInput(v-model="business.address[key]" :label="key" type="text")

    SrText(text="Cuentas Bancarias" class="subtitle")
    ul.data-list
      li.data-list-item(v-for="(value, key) in business.bank_accounts" :key="key")
        SrFormInput(v-model="business.bank_accounts[key].bank_name" label="Nombre banco" type="text")
        SrFormInput(v-model="business.bank_accounts[key].account_number" label="Numero de cuenta" type="text")
        button(@click="business.bank_accounts.splice(key, 1)") Eliminar
      li.data-list-item
        SrFormInput(v-model="newBank.bank_name" label="Nombre banco" type="text")
        SrFormInput(v-model="newBank.account_number" label="Numero de cuenta" type="text")
        button(@click="addAccount") Agregar

    SrText(text="Redes Sociales" class="subtitle")
    ul.data-list.wrapped
      li.data-list-item(v-for="(value, key) in business.social" :key="key")
        SrFormInput(v-model="business.social[key].url" :label="value.label" type="text")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});
const newBank = ref({
  bank_name: "",
  account_number: "",
});

const [{ data: business }, { data: terms }] = await Promise.all([
  useFetch("/api/content?page=_config/business"),
  useFetch("/api/content?page=_config/terms"),
]);

console.log(business, terms);

const updateBusiness = async () => {
  try {
    await $fetch("/api/content?page=_config/business", {
      method: "PUT",
      body: business.value,
    });
  } catch (error) {
    console.error(error);
  }
};

const addAccount = () => {
  business.value.bank_accounts.push({ ...newBank.value });
  newBank.value = { bank_name: "", account_number: "" };
};
</script>

<style lang="scss" scoped>
.quivi-business {
  &-header {
    margin-bottom: pxToRem(20);
  }
  .data-list {
    &.wrapped {
      display: flex;
      flex-wrap: wrap;
      gap: pxToRem(20);

      .data-list-item {
        .sr-form-input {
          max-width: 100%;
        }
      }
    }
    &:not(:last-child) {
      margin-bottom: pxToRem(20);
    }

    &-item {
      display: flex;
      align-items: center;
      gap: pxToRem(10);
      padding: pxToRem(10) 0;

      .sr-form-input {
        max-width: 33.3333%;
      }
    }
  }
}
</style>
