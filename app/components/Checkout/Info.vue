<template lang="pug">
  UForm.flex.flex-col.gap-6(:state="formState" :schema="schema" @submit="processData")
    fieldset.grid(class="grid-cols-1 md:grid-cols-2 gap-4")
      legend.font-bebas.text-3xl Datos personales
      UFormField(label="Nombre" name="shipping.name" required)
        UInput.w-full(v-model="formState.shipping.name" placeholder="Nombre")
      UFormField(label="Apellidos" name="shipping.last_name" required)
        UInput.w-full(v-model="formState.shipping.last_name" placeholder="Apellidos")
      UFormField(label="E-mail" name="shipping.email" required)
        UInput.w-full(v-model="formState.shipping.email" type="email" placeholder="correo@dominio.com")
      UFormField(label="Telefono" name="shipping.phone" required)
        UInput.w-full(v-model="formState.shipping.phone" type="tel" placeholder="Telefono")

    fieldset.grid(class="grid-cols-1 md:grid-cols-2 gap-4")
      legend.font-bebas.text-3xl Direccion de envio
      UFormField(label="Calle" name="shipping.address.street" required)
        UInput.w-full(v-model="formState.shipping.address.street" placeholder="Calle")
      UFormField(label="Numero exterior" name="shipping.address.ext_num" required)
        UInput.w-full(v-model="formState.shipping.address.ext_num" placeholder="Numero exterior")
      UFormField(label="Numero interior" name="shipping.address.int_num")
        UInput.w-full(v-model="formState.shipping.address.int_num" placeholder="Numero interior")
      UFormField(label="Colonia" name="shipping.address.neighborhood" required)
        UInput.w-full(v-model="formState.shipping.address.neighborhood" placeholder="Colonia")
      UFormField(label="Estado" name="shipping.address.state" required)
        USelect.w-full(v-model="formState.shipping.address.state" :items="stateOptions")
      UFormField(label="Municipio" name="shipping.address.city" required)
        USelect.w-full(v-model="formState.shipping.address.city" :items="shippingCityOptions")
      UFormField(label="Codigo postal" name="shipping.address.zip" required)
        UInput.w-full(v-model="formState.shipping.address.zip" placeholder="Codigo postal")

    fieldset.grid(class="grid-cols-1 md:grid-cols-2 gap-4")
      UFormField(name="billingSw")
        UCheckbox(v-model="formState.billingSw" size="lg" label="Requiero Factura")

    fieldset.grid(class="grid-cols-1 md:grid-cols-2 gap-4" v-if="formState.billingSw")
      legend.font-bebas.text-3xl Datos de facturacion
      UFormField(label="Nombre / Razon Social" name="billing.name" required)
        UInput.w-full(v-model="formState.billing.name" placeholder="Nombre / Razon Social")
      UFormField(label="Telefono" name="billing.phone" required)
        UInput.w-full(v-model="formState.billing.phone" type="tel" placeholder="Telefono")
      UFormField(label="E-mail" name="billing.email" required)
        UInput.w-full(v-model="formState.billing.email" type="email" placeholder="correo@dominio.com")
      UFormField(label="RFC" name="billing.rfc" required)
        UInput.w-full(v-model="formState.billing.rfc" placeholder="RFC")
      UFormField(label="CFDI" name="billing.cfdi" required)
        USelect.w-full(v-model="formState.billing.cfdi" :items="usosOptions")
      UFormField(label="Regimen" name="billing.regime" required)
        USelect.w-full(v-model="formState.billing.regime" :items="regimenesOptions")

    fieldset.grid(class="grid-cols-1 md:grid-cols-2 gap-4" v-if="formState.billingSw")
      legend.font-bebas.text-3xl Direccion de facturacion
      UFormField.flex.items-center(name="billingAddressSw")
        UCheckbox(v-model="formState.billingAddressSw" size="lg" label="Usar direccion de envio")
      UFormField(label="Calle" name="billing.address.street" required)
        UInput.w-full(v-model="formState.billing.address.street" :disabled="formState.billingAddressSw" placeholder="Calle")
      UFormField(label="Numero exterior" name="billing.address.ext_num" required)
        UInput.w-full(v-model="formState.billing.address.ext_num" :disabled="formState.billingAddressSw" placeholder="Numero exterior")
      UFormField(label="Numero interior" name="billing.address.int_num")
        UInput.w-full(v-model="formState.billing.address.int_num" :disabled="formState.billingAddressSw" placeholder="Numero interior")
      UFormField(label="Colonia" name="billing.address.neighborhood" required)
        UInput.w-full(v-model="formState.billing.address.neighborhood" :disabled="formState.billingAddressSw" placeholder="Colonia")
      UFormField(label="Estado" name="billing.address.state" required)
        USelect.w-full(v-model="formState.billing.address.state" :items="stateOptions" :disabled="formState.billingAddressSw")
      UFormField(label="Municipio" name="billing.address.city" required)
        USelect.w-full(v-model="formState.billing.address.city" :items="billingCityOptions" :disabled="formState.billingAddressSw")
      UFormField(label="Codigo postal" name="billing.address.zip" required)
        UInput.w-full(v-model="formState.billing.address.zip" :disabled="formState.billingAddressSw" placeholder="Codigo postal")

    .mt-4
      UButton(type="submit" label="Continuar")
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { EstadosMap, LabeledOption } from "~/types";

const props = defineProps({
  sat: {
    type: Object,
    required: true,
  },
});

const { shipping, billing, billingSw, billingAddressSw, setStep } =
  useCheckout();

const { data: estados } = await useAsyncData("config-estados", () =>
  queryCollection("configEstados").first(),
);

const normalizeEstados = (value: unknown): EstadosMap => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<EstadosMap>(
    (acc, [estado, municipios]) => {
      if (!Array.isArray(municipios)) {
        acc[estado] = [];
        return acc;
      }

      acc[estado] = municipios
        .filter(
          (municipio): municipio is string => typeof municipio === "string",
        )
        .map((municipio) => municipio.trim())
        .filter((municipio) => municipio !== "");

      return acc;
    },
    {},
  );
};

const estadosMap = computed<EstadosMap>(() =>
  normalizeEstados((estados.value as { meta?: unknown } | null)?.meta),
);

const stateOptions = computed(() =>
  Object.keys(estadosMap.value)
    .filter((state) => state != null && String(state).trim() !== "")
    .map((state) => ({
      value: String(state).trim(),
      label: String(state).trim(),
    })),
);

const { usos, regimenes } = props.sat;

const usosOptions = computed(() =>
  (usos || [])
    .filter((item: any) => {
      const val = typeof item === "object" ? item?.value : item;
      return val != null && String(val).trim() !== "";
    })
    .map((item: any) => {
      if (typeof item === "object" && item.value != null) {
        return {
          value: String(item.value).trim(),
          label: item.label || item.name || String(item.value).trim(),
        };
      }
      return { value: String(item).trim(), label: String(item).trim() };
    }),
);

const regimenesOptions = computed(() =>
  (regimenes || [])
    .filter((item: any) => {
      const val = typeof item === "object" ? item?.value : item;
      return val != null && String(val).trim() !== "";
    })
    .map((item: any) => {
      if (typeof item === "object" && item.value != null) {
        return {
          value: String(item.value).trim(),
          label: item.label || item.name || String(item.value).trim(),
        };
      }
      return { value: String(item).trim(), label: String(item).trim() };
    }),
);

const optionalText = z.string().optional().or(z.literal(""));
const requiredText = (message: string) => z.string().min(1, message).trim();

const addressSchema = z.object({
  street: requiredText("La calle es requerida"),
  ext_num: requiredText("El numero exterior es requerido"),
  int_num: optionalText,
  neighborhood: requiredText("La colonia es requerida"),
  state: requiredText("El estado es requerido"),
  city: requiredText("El municipio es requerido"),
  zip: requiredText("El codigo postal es requerido"),
  country: z.string().default("MX"),
});

const billingSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  rfc: z.string(),
  cfdi: z.string(),
  regime: z.string(),
  address: z.object({
    street: z.string(),
    ext_num: z.string(),
    int_num: z.string().optional().or(z.literal("")),
    neighborhood: z.string(),
    state: z.string(),
    city: z.string(),
    zip: z.string(),
    country: z.string().default("MX"),
  }),
});

const billingRequiredSchema = z.object({
  name: requiredText("El nombre es requerido"),
  phone: requiredText("El telefono es requerido"),
  email: z
    .string()
    .min(1, "El correo electronico es requerido")
    .email("Ingresa un correo electronico valido"),
  rfc: requiredText("El RFC es requerido"),
  cfdi: requiredText("El CFDI es requerido"),
  regime: requiredText("El regimen es requerido"),
  address: addressSchema,
});

const schema = z
  .object({
    shipping: z.object({
      name: requiredText("El nombre es requerido"),
      last_name: requiredText("Los apellidos son requeridos"),
      email: z
        .string()
        .min(1, "El correo electronico es requerido")
        .email("Ingresa un correo electronico valido"),
      phone: requiredText("El telefono es requerido"),
      address: addressSchema,
    }),
    billingSw: z.boolean(),
    billingAddressSw: z.boolean().optional(),
    billing: billingSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.billingSw) return;
    const result = billingRequiredSchema.safeParse(data.billing ?? {});
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ["billing", ...issue.path],
        });
      });
    }
  });

const emptyAddress = (): {
  street: string;
  ext_num: string;
  int_num: string;
  neighborhood: string;
  state: string;
  city: string;
  zip: string;
  country: string;
} => ({
  street: "",
  ext_num: "",
  int_num: "",
  neighborhood: "",
  state: "",
  city: "",
  zip: "",
  country: "MX",
});

const formState = reactive<
  Omit<z.output<typeof schema>, "billing"> & {
    billing: z.output<typeof billingRequiredSchema>;
  }
>({
  shipping: {
    name: "",
    last_name: "",
    email: "",
    phone: "",
    address: emptyAddress(),
  },
  billingSw: false,
  billingAddressSw: false,
  billing: {
    name: "",
    phone: "",
    email: "",
    rfc: "",
    cfdi: "",
    regime: "",
    address: emptyAddress(),
  },
});

const shippingCityOptions = ref<LabeledOption[]>([]);
const billingCityOptions = ref<LabeledOption[]>([]);

const updateMunicipios = (type: "shipping" | "billing", state: string) => {
  const municipios: string[] = estadosMap.value[state] ?? [];
  const options = municipios
    .filter((municipio) => municipio.trim() !== "")
    .map((municipio) => ({
      value: municipio.trim(),
      label: municipio.trim(),
    }));
  if (type === "shipping") {
    shippingCityOptions.value = options;
  } else {
    billingCityOptions.value = options;
  }
  if (!municipios.includes(formState[type].address.city)) {
    formState[type].address.city = "";
  }
};

const syncBillingAddress = () => {
  formState.billing.address = {
    ...formState.shipping.address,
  };
  updateMunicipios("billing", formState.shipping.address.state);
};

watch(
  () => formState.shipping.address.state,
  (value) => {
    updateMunicipios("shipping", value);
    if (formState.billingAddressSw) {
      formState.billing.address.state = value;
      updateMunicipios("billing", value);
    }
  },
);

watch(
  () => formState.billing.address.state,
  (value) => {
    if (!formState.billingAddressSw) {
      updateMunicipios("billing", value);
    }
  },
);

watch(
  () => formState.shipping.address,
  () => {
    if (formState.billingAddressSw) {
      syncBillingAddress();
    }
  },
  { deep: true },
);

watch(
  () => formState.billingSw,
  (value) => {
    if (!value) {
      formState.billingAddressSw = false;
    }
  },
);

watch(
  () => formState.billingAddressSw,
  (value) => {
    if (value) {
      syncBillingAddress();
    }
  },
);

const processData = (event: FormSubmitEvent<z.output<typeof schema>>) => {
  console.log("Form submitted with data:", event.data);
  shipping.value = {
    ...event.data.shipping,
    address: {
      ...event.data.shipping.address,
      int_num: event.data.shipping.address.int_num ?? "",
    },
  };
  billingSw.value = event.data.billingSw;
  billingAddressSw.value = event.data.billingAddressSw ?? false;
  if (event.data.billingSw && event.data.billing) {
    billing.value = {
      ...event.data.billing,
      address: {
        ...event.data.billing.address,
        int_num: event.data.billing.address.int_num ?? "",
      },
    };
  }
  setStep(1);
};

onMounted(() => {
  formState.billingSw = billingSw.value;
  formState.billingAddressSw = billingAddressSw.value;
  if (shipping.value) {
    formState.shipping = {
      ...formState.shipping,
      ...shipping.value,
      address: {
        ...formState.shipping.address,
        ...(shipping.value.address || {}),
      },
    };
  }
  if (billing.value) {
    formState.billing = {
      ...formState.billing,
      ...billing.value,
      address: {
        ...formState.billing.address,
        ...(billing.value.address || {}),
      },
    };
  }
  if (formState.shipping.address.state) {
    updateMunicipios("shipping", formState.shipping.address.state);
  }
  if (formState.billing.address.state) {
    updateMunicipios("billing", formState.billing.address.state);
  }
  if (formState.billingAddressSw) {
    syncBillingAddress();
  }
});
</script>
