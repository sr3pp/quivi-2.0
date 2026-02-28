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
import type { BusinessConfig } from "~/types";

definePageMeta({
  layout: "panel",
});

const newBank = ref({
  bank_name: "",
  account_number: "",
});

const emptyBusiness = (): BusinessConfig => ({
  address: {},
  bank_accounts: [],
  social: [],
});

const normalizeBusiness = (value: unknown): BusinessConfig => {
  const fallback = emptyBusiness();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const raw = value as Record<string, unknown>;

  const address =
    raw.address && typeof raw.address === "object"
      ? Object.entries(raw.address as Record<string, unknown>).reduce<
          Record<string, string>
        >((acc, [key, item]) => {
          if (typeof item === "string") {
            acc[key] = item;
          }
          return acc;
        }, {})
      : fallback.address;

  const bank_accounts = Array.isArray(raw.bank_accounts)
    ? raw.bank_accounts
        .filter(
          (item): item is { bank_name?: unknown; account_number?: unknown } =>
            !!item && typeof item === "object",
        )
        .map((item) => ({
          bank_name: typeof item.bank_name === "string" ? item.bank_name : "",
          account_number:
            typeof item.account_number === "string" ? item.account_number : "",
        }))
    : fallback.bank_accounts;

  const social = Array.isArray(raw.social)
    ? raw.social
        .filter(
          (item): item is { label?: unknown; url?: unknown; icon?: unknown } =>
            !!item && typeof item === "object",
        )
        .map((item) => ({
          label: typeof item.label === "string" ? item.label : "",
          url: typeof item.url === "string" ? item.url : "",
          icon: typeof item.icon === "string" ? item.icon : undefined,
        }))
    : fallback.social;

  return {
    address,
    bank_accounts,
    social,
  };
};

const business = ref<BusinessConfig>(emptyBusiness());

const { data } = await useAsyncData<BusinessConfig>("business", async () => {
  const item = await queryCollection("config")
    .where("stem", "=", "config/business")
    .first();

  return normalizeBusiness(item?.meta ?? item);
});

if (data.value) {
  business.value = data.value;
}

const addAccount = () => {
  business.value.bank_accounts.push({ ...newBank.value });
  newBank.value = { bank_name: "", account_number: "" };
};
</script>
