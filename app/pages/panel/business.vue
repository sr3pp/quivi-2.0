<template lang="pug">
div
  UContainer(:with-padding="true")
    UPageGrid(class="mb-5")
      div(class="col-span-1 sm:col-span-2")
        p(class="title") Configuración de la Empresa
      div(class="col-span-1 sm:col-span-2")
        UButton(@click="updateBusiness" class="sr-button--primary" variant="secondary" label="Guardar cambios")
    p  Direccion
    ul(class="mb-5 flex flex-wrap gap-5")
      li(v-for="(value, key) in business.address" :key="key" class="flex items-center gap-2.5 py-2.5")
        UInput(v-model="business.address[key]" :label="key" type="text" class="w-full")

    p  Cuentas Bancarias
    ul(class="mb-5")
      li(v-for="(value, key) in business.bank_accounts" :key="key" class="flex items-center gap-2.5 py-2.5")
        UInput(v-model="business.bank_accounts[key].bank_name" label="Nombre banco" type="text" class="w-full sm:max-w-1/3")
        UInput(v-model="business.bank_accounts[key].account_number" label="Numero de cuenta" type="text" class="w-full sm:max-w-1/3")
        button(@click="business.bank_accounts.splice(key, 1)") Eliminar
      li(class="flex items-center gap-2.5 py-2.5")
        UInput(v-model="newBank.bank_name" label="Nombre banco" type="text" class="w-full sm:max-w-1/3")
        UInput(v-model="newBank.account_number" label="Numero de cuenta" type="text" class="w-full sm:max-w-1/3")
        button(@click="addAccount") Agregar

    p Redes Sociales
    ul(class="flex flex-wrap gap-5")
      li(v-for="(value, key) in business.social" :key="key" class="flex items-center gap-2.5 py-2.5")
        UInput(v-model="business.social[key].url" :label="value.label" type="text" class="w-full")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});
const newBank = ref({
  bank_name: "",
  account_number: "",
});

const { data: business } = await useFetch("/api/content?page=_config/business");

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
