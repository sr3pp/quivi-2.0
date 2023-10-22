<template lang="pug">
ul.quivi-product-filters
    li.quivi-product-filters-item(v-for="(item, i) in filtersForm" :key="i")
        label
            span {{item.label}}
            input(type="text" v-model="filtersForm.car_brand" list="car_brands")
            datalist(id="car_brands")
                option(v-for="(opt, j) in item.options" :key="j" :id="opt.value" :value="opt.label")
</template>

<script lang="ts" setup>
const filtersForm: any = [
  {
    label: "Vehiculo",
    options: [
      {
        label: "Altima",
        value: "940495430",
      },
      {
        label: "bmw",
        value: "kfre09id",
      },
      {
        label: "audi",
        value: "deo0wdew",
      },
    ],
  },
  {
    label: "Submarca",
    options: [
      {
        label: "a12",
        value: "code094",
      },
      {
        label: "ERd23",
        value: "4g6566",
      },
      {
        label: "980M",
        value: "r43r43",
      },
    ],
  },
  {
    label: "Año",
    options: [
      {
        label: "1992",
        value: "1992",
      },
      {
        label: "1993",
        value: "1993",
      },
      {
        label: "1994",
        value: "1994",
      },
    ],
  },
  {
    label: "Motor",
    options: [
      {
        label: "A44",
        value: "e433f5g3q",
      },
      {
        label: "P300",
        value: "121fde993",
      },
      {
        label: "AR900",
        value: "fr34t5y65",
      },
    ],
  },
  {
    label: "Categoria",
    options: [
      {
        label: "Llantas",
        value: "r439ew",
      },
      {
        label: "Defensa",
        value: "49ri8ow",
      },
      {
        label: "Rines",
        value: "0d9iw0w",
      },
    ],
  },
];

const filter = (data: any) => {
  console.log(data);
};
</script>

<style lang="scss" scoped>
.quivi-product-filters {
  &-item {
    label {
      display: flex;
      flex-direction: column;
    }
    input {
      appearance: none;
      height: unit(40);
      padding: unit(10);
      border: solid unit(2) $color-quivi-light-gray;
      border-radius: unit(8);
    }
  }
}
</style>
