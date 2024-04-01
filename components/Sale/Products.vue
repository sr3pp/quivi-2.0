<script lang="ts" setup>
defineProps({
  products: {
    type: Array,
    default: () => [],
  },
});
</script>

<template lang="pug">
table.sale-products
    thead
      tr
        th WEB
        th SAE
        th Product
        th Quantity
        th Price
        th Current Price
    tbody
      tr(v-for="(product, i) in products" :key="i")
        td {{ product.product.web }}
        td {{ product.product.sae }}
        td {{ product.product.name }}
        td {{ product.quantity }}
        td {{ product.price }}
        td {{ product.product.price }}

</template>

<style lang="scss">
.sale-products {
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    text-align: center;
    border: 1px solid #000;
    padding: 5px;
  }
  th {
    background-color: #000;
    color: #fff;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  tr:hover {
    background-color: #ddd;
  }
}
</style>
