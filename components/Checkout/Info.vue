<template lang="pug">
.quivi-checkout-info
  SrForm.quivi-checkout-form(:fieldsets="saleForm" @submit="processData" submit="hidden")
    template(#submit)
      QuiviButton(label="Continuar")
</template>

<script lang="ts" setup>
import { validateForm, dataFromForm } from "sr-content-2/assets/ts/utilities";

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
    emitInfo(data);
  }
};

const props = defineProps({
  saleData: {
    type: Object,
    default: () => ({}),
  },
  sat: {
    type: Object,
    default: () => ({
      usos: [],
      regimenes: [],
    }),
  },
});
const { usos, regimenes } = props.sat;

const billSw = ref(false);
const billAddressSw = ref(false);

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
          name: "billSw",
          modelValue: billSw.value,
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
  if (billAddressSw.value) {
    saleForm.value.forEach((fieldset: any) => {
      fieldset.fields.forEach((field: any) => {
        if (field.props.name === key.replace("shipping", "bill")) {
          field.props.value = e.target.value;
          if (field.props.name === "bill.address.state") {
            setMunicipio("bill", e);
          }
        }
      });
    });
  }
};

const appendBilling = (sw: boolean) => {
  billSw.value = sw;
  const fieldsets = [
    {
      name: "Datos de facturación",
      fields: [
        {
          component: "SrFormInput",
          props: {
            name: "bill.name",
            required: true,
            label: "Nombre / Razón Social",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.phone",
            required: true,
            label: "Telefono",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.email",
            required: true,
            label: "E-mail",
            type: "email",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.rfc",
            required: true,
            label: "RFC",
            value: "",
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "bill.cfdi",
            required: true,
            label: "_",
            value: "",
            options: usos,
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "bill.regime",
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
            name: "bill.address.street",
            required: true,
            label: "Calle",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.address.ext_num",
            label: "Numero exterior",
            required: true,
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.address.int_num",
            label: "Numero interior",
            value: "",
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.address.neighborhood",
            required: true,
            label: "Colonia",
            value: "",
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "bill.address.state",
            label: "_",
            required: true,
            value: "",
            options: stateOptions,
            onChange: (e: InputEvent) => {
              setMunicipio("bill", e);
              updateBillingAddress("bill.address.state", e);
            },
          },
        },
        {
          component: "SrFormSelect",
          props: {
            name: "bill.address.city",
            label: "_",
            required: true,
            value: "",
            options: [],
          },
        },
        {
          component: "SrFormInput",
          props: {
            name: "bill.address.zip",
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
  if (!billSw.value) return;

  billAddressSw.value = !billAddressSw.value;

  saleForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.name.includes("bill.address")) {
        field.props.disabled = billAddressSw.value;
        if (field.props.name === "bill.address.state" && billAddressSw.value) {
          const field = findField("shipping.address.state");
          if (field.props.value) {
            setMunicipio("bill", {
              target: { value: field.props.value },
            } as any);
          }
        }
      }
    });
  });

  if (billAddressSw.value) {
    saleForm.value.forEach((fieldset: any) => {
      fieldset.fields.forEach((field: any) => {
        if (field.props.name.includes("bill.address")) {
          field.props.disabled = true;
          field.props.value = findField(
            field.props.name.replace("bill", "shipping"),
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
  if (rest.length) {
    accessObject(rest, field, data[key]);
  } else {
    field.props.value = data[key];
    if (field.props.value && field.props.name === "bill.address.state") {
      setMunicipio("bill", {
        target: { value: data[key] },
      } as any);
    }
    if (field.props.value && field.props.name === "shipping.address.state") {
      setMunicipio("shipping", {
        target: { value: data[key] },
      } as any);
    }
    if (
      props.saleData.billingAddressSw &&
      field.props.name.includes("bill.address")
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
  if (props.saleData.billSw) {
    appendBilling(true);
  }
  fillForm(props.saleData);
});

const emits = defineEmits(["save-info", "next-step"]);

const emitInfo = (data: any) => {
  emits("save-info", data);
};
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
      width: calc((100% / 3) - pxToRem(8));
      flex-grow: 1;

      &:last-child {
        flex-grow: 0;
      }
    }
  }
}
</style>
