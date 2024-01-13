<template lang="pug">
.panel
  SrContainer(:with_space="true")
    SrText(value="Panel ventas" class="title" alignment="center")
    button(@click="salesModal = true") Create venta
    table
      tbody
        tr(v-for="(sale, i) in sales" :key="i")
          td {{ sale.customer.name }}
          td {{ sale.created_at }}
          td
            button(@click="saleDetail(sale)") detail
            button(@click="deleteSale(sale._id, i)") Delete

    SrModal(:active="salesModal" @close="salesModal = false")
      template(#body)
        SrForm(:form="salesForm" @submit="saveSale")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const salesModal: Ref<boolean> = ref(false);

const { data: sales } = await useFetch("/api/sales");

const salesForm = {
  order_no: "",
  sae_order: "",
  status: false,
  total: 0,
  discount: 0,
  user_select: {
    value: "",
    options: [],
  },
  customer: {
    name: "",
    email: "",
    phone: "",
  },
  payment: {
    transaction: "",
    method: "",
    status: false,
    installments: 0,
  },
};

const saleDetail = (_sale: any) => {
  console.log("saleDetail", _sale);
};

const deleteSale = async (id: string, idx: number) => {
  await useFetch(`/api/sales`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  sales.value?.splice(idx, 1);
};

const saveSale = (_sale: any) => {
  console.log(_sale);
};
</script>

<style lang="scss" scoped>
.panel {
}
</style>
