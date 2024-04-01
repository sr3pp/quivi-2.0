<template lang="pug">
.quivi-checkout-resume
  SrGrid
    SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="column")
        SrText(text="Datos de Personales" class="subtitle")
        template(v-for="(value, key) in shippmentData")
            p(v-if="typeof value == 'string'")
              strong {{ keyDict[key] }}: 
              span {{ value }}
            template(v-else-if="typeof value == 'object'")
              br
              br
              SrText(text="Dirección de envio" class="subtitle")
              p(v-for="(v, k) in value")
                strong {{ keyDict[k] }}: 
                span {{ v }}

    SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="column")
        SrText(text="Metodo de pago" class="subtitle")
        SrText(:text="paymentMethod.name")
        br
        br
        template(v-if="billingSw")
          SrText(text="Datos de Facturacion" class="subtitle")
          template(v-for="(value, key) in billData")
            p(v-if="typeof value == 'string'")
              strong {{ keyDict[key] || key }}: 
              span {{ key == '' ? value : getSatValue(key, value) }}
            template(v-else-if="typeof value == 'object'")
                  p(v-for="(v, k) in value")
                    strong {{ keyDict[k] }}: 
                    span {{ v }}

        small.quivi-checkout-resume-safelegend(v-html="safeLegend")
</template>

<script lang="ts" setup>
const props = defineProps({
  shippmentData: {
    type: Object,
    default: () => ({}),
  },
  paymentMethod: {
    type: Object,
    default: () => ({
      value: "",
      name: "",
    }),
  },
  billingSw: {
    type: Boolean,
    default: false,
  },
  billData: {
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

const keyDict = {
  name: "Nombre",
  last_name: "Apellidos",
  email: "Correo",
  phone: "Teléfono",
  street: "Calle",
  ext_num: "Número",
  int_num: "Número int.",
  city: "Ciudad",
  state: "Estado",
  zip: "Código Postal",
  neighborhood: "Colonia",
  regime: "Régimen Fiscal",
  cfdi: "Uso de CFDI",
  rfc: "RFC",
};

const safeLegend = `Quivi.mx no almacena datos de tarjetas de crédito o débito. Todos los pagos son procesados por Openpay, Paypal <small>(Plataformas de pagos seguras y confiables)</small> o el establecimiento donde realices el pago.`;

const getSatValue = (key: string, value: string) => {
  if (["cfdi", "regime"].includes(key)) {
    const name = key == "cfdi" ? "usos" : "regimenes";
    return props.sat[name].find((el: any) => el.value == value).name;
  }

  return value;
};
</script>

<style lang="scss">
.quivi-checkout-resume {
  &-safelegend {
    margin-top: auto;
    padding-top: pxToRem(20);
  }
}
</style>
