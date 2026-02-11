<template lang="pug">
UPageGrid
    div(class="col-span-12 sm:col-span-6 md:col-span-4")
        p.font-bebas.text-3xl Datos de Personales
        template(v-for="(value, key) in shippmentData")
            p(v-if="typeof value == 'string'")
              strong {{ keyDict[key] }}: 
              span {{ value }}
            template(v-else-if="typeof value == 'object'")
              br
              br
              p.font-bebas.text-3xl Dirección de envio
              p(v-for="(v, k) in value")
                strong {{ keyDict[k] }}: 
                span {{ v }}

    div(class="col-span-12 sm:col-span-6 md:col-span-8")
        p.font-bebas.text-3xl Metodo de pago
        p {{ paymentMethod.label || paymentMethod.value || "No seleccionado" }}
        br
        br
        template(v-if="billingSw")
          p.font-bebas.text-3xl Datos de Facturacion
          template(v-for="(value, key) in billData")
            p(v-if="typeof value == 'string'")
              strong {{ keyDict[key] || key }}: 
              span {{ key == '' ? value : getSatValue(key, value) }}
            template(v-else-if="typeof value == 'object'")
                  p(v-for="(v, k) in value")
                    strong {{ keyDict[k] }}: 
                    span {{ v }}

        small(class="mt-auto pt-5" v-html="safeLegend")
</template>

<script lang="ts" setup>
const {
  billing: billData,
  shipping: shippmentData,
  paymentMethod,
  billingSw,
} = useCheckout();

const props = defineProps({
  sat: {
    type: Object,
    required: true,
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
    const satGroups = props.sat as Record<
      string,
      Array<{ value: string; name: string }>
    >;
    return satGroups[name]?.find((el) => el.value == value)?.name || value;
  }

  return value;
};
</script>
