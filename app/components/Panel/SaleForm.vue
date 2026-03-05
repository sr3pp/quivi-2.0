<template lang="pug">
UForm.space-y-6(:state="formState" :schema="schema" @submit="onSubmit")
  fieldset.grid.grid-cols-1.gap-4(class="sm:grid-cols-2")
    legend.font-semibold Sale
    UFormField(label="Order No" name="sale.order_no" required)
      UInput(v-model="formState.sale.order_no")
    UFormField(label="SAE No." name="sale.sae_order" required)
      UInput(v-model="formState.sale.sae_order")
    UFormField(label="Status" name="sale.status" required)
      UInput(v-model="formState.sale.status")
    UFormField(label="Discount" name="sale.discount" required)
      UInput(v-model="formState.sale.discount" type="number")
    UFormField(label="User" name="sale.user" required)
      USelect(v-model="formState.sale.user" :items="userOptions")

  fieldset.grid.grid-cols-1.gap-4(class="sm:grid-cols-2")
    legend.font-semibold Shipment
    UFormField(label="Name" name="shipment.name" required)
      UInput(v-model="formState.shipment.name")
    UFormField(label="Last Name" name="shipment.last_name" required)
      UInput(v-model="formState.shipment.last_name")
    UFormField(label="Phone" name="shipment.phone" required)
      UInput(v-model="formState.shipment.phone")
    UFormField(label="Email" name="shipment.email" required)
      UInput(v-model="formState.shipment.email" type="email")
    UFormField(label="Street" name="shipment.address.street" required)
      UInput(v-model="formState.shipment.address.street")
    UFormField(label="Ext. Number" name="shipment.address.ext_num" required)
      UInput(v-model="formState.shipment.address.ext_num")
    UFormField(label="Int. Number" name="shipment.address.int_num")
      UInput(v-model="formState.shipment.address.int_num")
    UFormField(label="Neighborhood" name="shipment.address.neighborhood" required)
      UInput(v-model="formState.shipment.address.neighborhood")
    UFormField(label="City" name="shipment.address.city" required)
      UInput(v-model="formState.shipment.address.city")
    UFormField(label="State" name="shipment.address.state" required)
      UInput(v-model="formState.shipment.address.state")
    UFormField(label="Zip" name="shipment.address.zip" required)
      UInput(v-model="formState.shipment.address.zip")

  fieldset.grid.grid-cols-1.gap-4(class="sm:grid-cols-2")
    legend.font-semibold Billing
    UFormField(label="Name" name="billing.name" required)
      UInput(v-model="formState.billing.name")
    UFormField(label="Phone" name="billing.phone" required)
      UInput(v-model="formState.billing.phone")
    UFormField(label="Email" name="billing.email" required)
      UInput(v-model="formState.billing.email" type="email")
    UFormField(label="RFC" name="billing.rfc" required)
      UInput(v-model="formState.billing.rfc")
    UFormField(label="CFDI" name="billing.cfdi" required)
      USelect(v-model="formState.billing.cfdi" :items="cfdiOptions")
    UFormField(label="Regime" name="billing.regime" required)
      USelect(v-model="formState.billing.regime" :items="regimeOptions")
    UFormField(label="Street" name="billing.address.street" required)
      UInput(v-model="formState.billing.address.street")
    UFormField(label="Ext. Number" name="billing.address.ext_num" required)
      UInput(v-model="formState.billing.address.ext_num")
    UFormField(label="Int. Number" name="billing.address.int_num")
      UInput(v-model="formState.billing.address.int_num")
    UFormField(label="Neighborhood" name="billing.address.neighborhood" required)
      UInput(v-model="formState.billing.address.neighborhood")
    UFormField(label="City" name="billing.address.city" required)
      UInput(v-model="formState.billing.address.city")
    UFormField(label="State" name="billing.address.state" required)
      UInput(v-model="formState.billing.address.state")
    UFormField(label="Zip" name="billing.address.zip" required)
      UInput(v-model="formState.billing.address.zip")

  .flex.justify-end
    UButton(type="submit" label="Guardar venta" :loading="loading")
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

export interface PanelSaleFormData {
  sale: {
    order_no: string;
    sae_order: string;
    status: string;
    discount: number;
    user: string;
  };
  shipment: {
    name: string;
    last_name: string;
    phone: string;
    email: string;
    address: {
      street: string;
      ext_num: string;
      int_num: string;
      neighborhood: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  billing: {
    name: string;
    phone: string;
    email: string;
    rfc: string;
    cfdi: string;
    regime: string;
    address: {
      street: string;
      ext_num: string;
      int_num: string;
      neighborhood: string;
      city: string;
      state: string;
      zip: string;
    };
  };
}

const props = withDefaults(
  defineProps<{
    userOptions: { label: string; value: string }[];
    cfdiOptions: { label: string; value: string }[];
    regimeOptions: { label: string; value: string }[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  (e: "submit", data: z.output<typeof schema>): void;
}>();

const requiredText = (message: string) => z.string().min(1, message).trim();
const optionalText = z.string().optional().or(z.literal(""));

const addressSchema = z.object({
  street: requiredText("Street es requerido"),
  ext_num: requiredText("Ext. Number es requerido"),
  int_num: optionalText,
  neighborhood: requiredText("Neighborhood es requerido"),
  city: requiredText("City es requerido"),
  state: requiredText("State es requerido"),
  zip: requiredText("Zip es requerido"),
});

const schema = z.object({
  sale: z.object({
    order_no: requiredText("Order No es requerido"),
    sae_order: requiredText("SAE No. es requerido"),
    status: requiredText("Status es requerido"),
    discount: z.coerce.number(),
    user: requiredText("User es requerido"),
  }),
  shipment: z.object({
    name: requiredText("Name es requerido"),
    last_name: requiredText("Last Name es requerido"),
    phone: requiredText("Phone es requerido"),
    email: z
      .string()
      .min(1, "Email es requerido")
      .email("Ingresa un email valido"),
    address: addressSchema,
  }),
  billing: z.object({
    name: requiredText("Name es requerido"),
    phone: requiredText("Phone es requerido"),
    email: z
      .string()
      .min(1, "Email es requerido")
      .email("Ingresa un email valido"),
    rfc: requiredText("RFC es requerido"),
    cfdi: requiredText("CFDI es requerido"),
    regime: requiredText("Regime es requerido"),
    address: addressSchema,
  }),
});

const formState = reactive<PanelSaleFormData>({
  sale: {
    order_no: "",
    sae_order: "",
    status: "",
    discount: 0,
    user: "",
  },
  shipment: {
    name: "",
    last_name: "",
    phone: "",
    email: "",
    address: {
      street: "",
      ext_num: "",
      int_num: "",
      neighborhood: "",
      city: "",
      state: "",
      zip: "",
    },
  },
  billing: {
    name: "",
    phone: "",
    email: "",
    rfc: "",
    cfdi: "",
    regime: "",
    address: {
      street: "",
      ext_num: "",
      int_num: "",
      neighborhood: "",
      city: "",
      state: "",
      zip: "",
    },
  },
});

const resetForm = () => {
  formState.sale.order_no = "";
  formState.sale.sae_order = "";
  formState.sale.status = "";
  formState.sale.discount = 0;
  formState.sale.user = "";

  formState.shipment.name = "";
  formState.shipment.last_name = "";
  formState.shipment.phone = "";
  formState.shipment.email = "";
  formState.shipment.address.street = "";
  formState.shipment.address.ext_num = "";
  formState.shipment.address.int_num = "";
  formState.shipment.address.neighborhood = "";
  formState.shipment.address.city = "";
  formState.shipment.address.state = "";
  formState.shipment.address.zip = "";

  formState.billing.name = "";
  formState.billing.phone = "";
  formState.billing.email = "";
  formState.billing.rfc = "";
  formState.billing.cfdi = "";
  formState.billing.regime = "";
  formState.billing.address.street = "";
  formState.billing.address.ext_num = "";
  formState.billing.address.int_num = "";
  formState.billing.address.neighborhood = "";
  formState.billing.address.city = "";
  formState.billing.address.state = "";
  formState.billing.address.zip = "";
};

const onSubmit = (event: FormSubmitEvent<z.output<typeof schema>>) => {
  emit("submit", event.data);
};

defineExpose({
  resetForm,
});
</script>
