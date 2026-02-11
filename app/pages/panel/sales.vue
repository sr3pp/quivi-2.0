<template lang="pug">
.sales
  UContainer(:with-padding="true")
    .sales-header
      .header-title
        SrText(text="Panel Ventas" class="title text-center")
        SrFormInput(v-model="search" @keyup.enter="searchSale" placeholder="Buscar")
        UButton(@click="searchSale")
          SvgIcon(name="lupa-o")

    SrText(value="Panel ventas" class="title" alignment="center")
    //button(@click="salesModal.toggle()") Create venta
    UTable(
      :columns="columns"
      :data="sales ?? []"
    )

    SrModal(ref="saleDetailModal")
      template(#body)
        SaleDetail(:sale="currentSale" v-if="currentSale")

    SrModal(ref="salesModal")
      template(#body)
          SrForm(:fieldsets="salesForm" @submit="saveSale")
</template>

<script lang="ts" setup>
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { PanelSaleRow, PanelSalesModal } from "~/types";
import { toPrice } from "~/assets/ts/utilities";

definePageMeta({
  layout: "panel",
});
const UButton = resolveComponent("UButton");

const orderSw = ref(false);

const salesModal: Ref<Component | null> = ref(null);
const saleDetailModal: Ref<PanelSalesModal | null> = ref(null);

const currentSale = ref<PanelSaleRow | null>(null);

const { data: sales } = await useFetch<PanelSaleRow[]>("/api/sales");

const columns: TableColumn<PanelSaleRow>[] = [
  {
    accessorKey: "order_no",
    header: "Order No",
  },
  {
    accessorKey: "sae_order",
    header: "SAE",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => row.original.products?.length ?? 0,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => toPrice(row.original.total ?? 0),
    meta: {
      class: {
        td: "text-right",
      },
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString("es-MX")
        : "",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-2" }, [
        h(UButton, {
          icon: "i-lucide-eye",
          color: "primary",
          variant: "ghost",
          size: "sm",
          "aria-label": "Detail",
          onClick: () => saleDetail(row.original),
        }),
        h(UButton, {
          icon: "i-lucide-trash",
          color: "error",
          variant: "ghost",
          size: "sm",
          "aria-label": "Delete",
          onClick: () => deleteSale(row.original),
        }),
      ]),
    meta: {
      class: {
        td: "text-right",
      },
    },
  },
];

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

const saleDetail = (sale: PanelSaleRow) => {
  currentSale.value = sales.value.find(
    (_sale) => _sale.order_no === sale.order_no,
  );
  saleDetailModal.value?.toggle();
};

const deleteSale = async (_sale: PanelSaleRow) => {
  const sale = sales.value.find(
    (saleItem) => saleItem.order_no === _sale.order_no,
  );
  if (!sale?._id) return;

  await $fetch(`/api/sales`, {
    method: "DELETE",
    body: JSON.stringify({ id: sale._id }),
  });
};

const saveSale = (_sale: unknown) => {
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
