<template lang="pug">
.sales
  SrContainer(:with-padding="true")
    .sales-header
      .header-title
        SrText(text="Panel Ventas" class="title text-center")
        SrFormInput(v-model="search" @keyup.enter="searchSale" placeholder="Buscar")
        QuiviButton(@click="searchSale")
          SrIcon(name="lupa-o")

    SrText(value="Panel ventas" class="title" alignment="center")
    //button(@click="salesModal.toggle()") Create venta
    DetailTable(
      :headers="['order_no', 'sae_order', 'products', 'total', 'status', 'createdAt', 'actions']"
      :data="sales"
      @detail="saleDetail"
      @delete="deleteSale"
      @update:data="(val) => sales = val"
      :actions="['detail', 'delete']"
    )

    SrModal(ref="saleDetailModal")
      template(#body)
        SaleDetail(:sale="currentSale" v-if="currentSale")

    SrModal(ref="salesModal")
      template(#body)
          SrForm(:fieldsets="salesForm" @submit="saveSale")
</template>

<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";

definePageMeta({
  layout: "panel",
});
const orderSw = ref(false);

const salesModal: Ref<Component | null> = ref(null);
const saleDetailModal: Ref<Component | null> = ref(null);

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

const search = ref("");

const searchSale = async () => {
  if (!search.value) {
    const { data: _sales } = await useFetch("/api/sales");
    sales.value = _sales.value;
  } else {
    const { data: _sale } = await useFetch(`/api/sales/${search.value}`);
    sales.value = [_sale.value];
  }
};

const saleDetail = (sale: any) => {
  currentSale.value = sales.value.find(
    (_sale: any) => _sale.order_no === sale.order_no,
  );
  (saleDetailModal.value as any).toggle();
};

const deleteSale = async (_sale: any) => {
  const sale = sales.value.find(
    (sale: any) => sale.order_no === _sale.order_no,
  );

  await $fetch(`/api/sales`, {
    method: "DELETE",
    body: JSON.stringify({ id: sale._id }),
  });
};

const saveSale = (_sale: any) => {
  console.log(_sale);
};
</script>

<style lang="scss" scoped>
.sales {
  .sales-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .header-title {
      display: flex;
      align-items: center;
      .sr-form-input {
        padding: 0;
        margin-left: pxToRem(10);
      }
      .quivi-button {
        margin-left: pxToRem(10);
        min-width: inherit;
      }
      .sr-icon {
        width: pxToRem(20);
        height: pxToRem(20);
      }
    }
  }
}
</style>
