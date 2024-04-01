<template lang="pug">
.panel
  SrContainer(:with-padding="true")
    SrText(value="Panel ventas" class="title" alignment="center")
    button(@click="salesModal = true") Create venta
    table
      thead
        tr
          th Order No
          th Sae No
          th Products
          th Total
          th 
            p Status
            button(@click="sortBy('status')") sort
          th Created At
          th Actions
      tbody
        tr(v-for="(sale, i) in sales" :key="i")
          td {{ sale.order_no }}
          td {{ sale.sae_order }}
          td {{ sale.products.length }}
          td {{ toPrice(sale.total) }}
          td 
            Status(:status="sale.status ? 2 : 0")
          td {{ new Date(sale.createdAt).toLocaleDateString('es-MX') }}
          td
            button(@click="saleDetail(sale)") detail
            button(@click="deleteSale(sale._id, i)") Delete

    SrModal(:active="currentSaleModal" @close="currentSaleModal = false")
      template(#body)
        .sr-modal-body
          SaleDetail(:sale="currentSale" v-if="currentSale")

    SrModal(:active="salesModal" @close="salesModal = false")
      template(#body)
        .sr-modal-body
          SrForm(:fieldsets="salesForm" @submit="saveSale")
</template>

<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";

definePageMeta({
  layout: "panel",
});

const salesModal: Ref<boolean> = ref(false);
const currentSaleModal: Ref<boolean> = ref(false);

const currentSale: Ref<any> = ref(null);

const { data: sales } = await useFetch("/api/sales");

const salesForm = [
  {
    name: "sale",
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "order_no",
          label: "Order No",
          required: true,
          value: "",
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "sae_order",
          label: "Sae No.",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "status",
          label: "Status",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "discount",
          label: "Discount",
          required: true,
        },
      },
      {
        component: "SrFormSelect",
        props: {
          name: "user",
          label: "User",
          required: true,
          options: [
            { value: "1", name: "User 1" },
            { value: "2", name: "User 2" },
          ],
        },
      },
    ],
  },
  {
    name: "shipment",
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "name",
          label: "Name",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "phone",
          label: "Phone",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "email",
          label: "Email",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.street",
          label: "Street",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.city",
          label: "City",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.state",
          label: "State",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.zip",
          label: "Zip",
          required: true,
        },
      },
    ],
  },
  {
    name: "Billing",
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "name",
          label: "Name",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "phone",
          label: "Phone",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "email",
          label: "Email",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.street",
          label: "Street",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.city",
          label: "City",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.state",
          label: "State",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "address.zip",
          label: "Zip",
          required: true,
        },
      },
    ],
  },
];

const saleDetail = (_sale: any) => {
  currentSale.value = _sale;
  currentSaleModal.value = true;
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

const sortBy = (field: string) => {
  sales.value = sales.value.sort((a: any, b: any) => {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  });
};
</script>

<style lang="scss" scoped>
.panel {
}
</style>
