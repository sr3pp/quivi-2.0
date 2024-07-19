<template lang="pug">
.quivi-checkout-info
  SrForm.quivi-checkout-form(:fieldsets="saleForm" @submit="processData" submit="hidden")
    template(#submit)
      QuiviButton(label="Continuar")
</template>

<script lang="ts" setup>
import { validateForm, dataFromForm } from "sr-content-2/assets/ts/utilities";

const props = defineProps({
  sat: {
    type: Object,
    required: true,
  },
});

const { shipping, billing, billingSw, billingAddressSw, setStep } =
  useCheckout();

const { estados } = await $fetch("/api/content?page=_config/estados");

const stateOptions = estados.map((state: any) => ({
  value: state.name,
  name: state.name,
}));

const processData = (data: any) => {
  if ("errors" in data) {
    //display errors
    console.log(data.errors);
  } else {
    shipping.value = data.shipping;
    billingSw.value = data.billingSw;
    if (billingSw.value) {
      billing.value = data.billing;
    }
    setStep(1);
  }
};

const { usos, regimenes } = props.sat;

const saleForm = ref([
  {
    name: "Datos personales",
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "shipping.name",
          required: true,
          label: "Nombre",
          value: "",
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.last_name",
          required: true,
          label: "Apellidos",
          value: "",
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.email",
          required: true,
          label: "E-mail",
          value: "",
          type: "email",
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.phone",
          required: true,
          label: "Telefono",
          value: "",
        },
      },
    ],
  },
  {
    name: "Direccion de envio",
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "shipping.address.street",
          required: true,
          label: "Calle",
          value: "",
          oninput: (e: any) => {
            updateBillingAddress("shipping.address.street", e);
          },
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.address.ext_num",
          label: "Numero exterior",
          required: true,
          value: "",
          oninput: (e: any) => {
            updateBillingAddress("shipping.address.ext_num", e);
          },
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.address.int_num",
          label: "Numero interior",
          value: "",
          oninput: (e: any) => {
            updateBillingAddress("shipping.address.int_num", e);
          },
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.address.neighborhood",
          required: true,
          label: "Colonia",
          value: "",
          oninput: (e: any) => {
            updateBillingAddress("shipping.address.neighborhood", e);
          },
        },
      },
      {
        component: "SrFormSelect",
        props: {
          name: "shipping.address.state",
          required: true,
          label: "_",
          value: "",
          options: stateOptions,
          onchange: (e: any) => {
            setMunicipio("shipping", e);
            updateBillingAddress("shipping.address.state", e);
          },
        },
      },
      {
        component: "SrFormSelect",
        props: {
          name: "shipping.address.city",
          label: "_",
          required: true,
          value: "",
          options: [],
          onchange: (e: any) => {
            updateBillingAddress("shipping.address.city", e);
          },
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "shipping.address.zip",
          required: true,
          label: "Codigo postal",
          value: "",
          oninput: (e: any) => {
            updateBillingAddress("shipping.address.zip", e);
          },
        },
      },
    ],
  },
  {
    name: "Facturacion",
    fields: [
      {
        component: "SrFormBox",
        props: {
          type: "checkbox",
          label: "Requiero Factura",
          name: "billingSw",
          modelValue: billingSw.value,
          onchange: (e: any) => {
            const sw = e.target.checked;
            appendBilling(sw);
          },
        },
      },
    ],
  },
]);

const updateBillingAddress = (key: string, e: any) => {
  if (billingAddressSw.value) {
    saleForm.value.forEach((fieldset: any) => {
      fieldset.fields.forEach((field: any) => {
        if (field.props.name === key.replace("shipping", "billing")) {
          field.props.value = e.target.value;
          if (field.props.name === "billing.address.state") {
            setMunicipio("billing", e);
          }
        }
      });
    });
  }
};

const appendBilling = (sw: boolean) => {
  billingSw.value = sw;
  const fieldsets = [
    {
      name: "Datos de facturación",
      fields: [
        {
          component: "SrFormInput",
          props: {
            name: "billing.name",
            required: true,
            label: "Nombre / Razón Social",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.phone",
            required: true,
            label: "Telefono",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.email",
            required: true,
            label: "E-mail",
            type: "email",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.rfc",
            required: true,
            label: "RFC",
            value: "",
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "billing.cfdi",
            required: true,
            label: "_",
            value: "",
            options: usos,
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "billing.regime",
            required: true,
            label: "_",
            value: "",
            options: regimenes,
          },
        },
        {
          component: "SrFormBox",
          props: {
            type: "checkbox",
            label: "Usar direccion de envio",
            value: false,
            name: "billingAddressSw",
            onchange: () => {
              setBillAddress();
            },
          },
        },
      ],
    },
    {
      name: "Direccion de facturación",
      fields: [
        {
          component: "SrFormInput",
          props: {
            name: "billing.address.street",
            required: true,
            label: "Calle",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.address.ext_num",
            label: "Numero exterior",
            required: true,
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.address.int_num",
            label: "Numero interior",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.address.neighborhood",
            required: true,
            label: "Colonia",
            value: "",
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "billing.address.state",
            label: "_",
            required: true,
            value: "",
            options: stateOptions,
            onChange: (e: InputEvent) => {
              setMunicipio("billing", e);
              updateBillingAddress("billing.address.state", e);
            },
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "billing.address.city",
            label: "_",
            required: true,
            value: "",
            options: [],
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "billing.address.zip",
            required: true,
            label: "Codigo postal",
            value: "",
          },
        },
      ],
    },
  ];
  if (sw) {
    fieldsets.forEach((fieldset: any) => {
      saleForm.value.push(fieldset);
    });
  } else {
    saleForm.value.splice(
      saleForm.value.length - fieldsets.length,
      fieldsets.length,
    );
  }
};

const findField = (fieldName: string): any => {
  let field;

  saleForm.value.some((fieldset: any) => {
    fieldset.fields.some((_field: any) => {
      if (_field.props.name === fieldName) {
        field = _field;
        return _field;
      }
    });
  });

  return field;
};

const setBillAddress = () => {
  if (!billingSw.value) return;

  billingAddressSw.value = !billingAddressSw.value;

  saleForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.name.includes("billing.address")) {
        field.props.disabled = billingAddressSw.value;
        if (
          field.props.name === "billing.address.state" &&
          billingAddressSw.value
        ) {
          const field = findField("shipping.address.state");
          if (field.props.value) {
            setMunicipio("billing", {
              target: { value: field.props.value },
            } as any);
          }
        }
      }
    });
  });

  if (billingAddressSw.value) {
    saleForm.value.forEach((fieldset: any) => {
      fieldset.fields.forEach((field: any) => {
        if (field.props.name.includes("billing.address")) {
          field.props.disabled = true;
          field.props.value = findField(
            field.props.name.replace("billing", "shipping"),
          ).props.value;
        }
      });
    });
  }
};

const setMunicipio = (key: string, event: InputEvent) => {
  const value = (event.target as HTMLInputElement).value;

  const municipios = estados.find(
    (state: any) => state.name === value,
  )?.municipios;

  const setMunicipios = (field: any, municipios: any) => {
    field.props.options = municipios.map((municipio: any) => ({
      value: municipio,
      name: municipio,
    }));
  };

  const field = findField(`${key}.address.city`);

  if (field) {
    setMunicipios(field, municipios);
  }

  return municipios;
};

const accessObject = (keys: string[], field: any, data: any) => {
  const [key, ...rest] = keys;
  if (!data[key]) return;
  if (rest.length) {
    accessObject(rest, field, data[key]);
  } else {
    field.props.value = data[key];
    if (field.props.value && field.props.name === "billing.address.state") {
      setMunicipio("billing", {
        target: { value: data[key] },
      } as any);
    }
    if (field.props.value && field.props.name === "shipping.address.state") {
      setMunicipio("shipping", {
        target: { value: data[key] },
      } as any);
    }
    if (
      billingAddressSw.value &&
      field.props.name.includes("billing.address")
    ) {
      field.props.disabled = true;
    }
  }
};

const fillForm = (data: any) => {
  saleForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      const name = field.props.name;
      if (name.includes(".")) {
        const keys = name.split(".");
        accessObject(keys, field, data);
      } else {
        field.props.value = data[name];
      }
    });
  });
};

onMounted(() => {
  if (billingSw.value) {
    appendBilling(true);
  }
  fillForm({
    shipping: shipping.value,
    billing: billing.value,
    billingSw: billingSw.value,
  });
});
</script>

<style lang="scss">
.quivi-checkout {
  &-info {
    .shipping-form {
      margin-bottom: pxToRem(20);
    }
  }
  &-form {
    fieldset {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .sr-form-input,
    .sr-form-select {
      width: 100%;
      @media (min-width: $breakpoint-md) {
        width: calc((100% / 3) - pxToRem(8));
        flex-grow: 1;
        &:last-child {
          flex-grow: 0;
        }
      }
    }
  }
}
</style>
