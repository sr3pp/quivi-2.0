<template lang="pug">
  UContainer(:with-padding="true")
    .flex.gap-4.items-center.justify-between
      UInput(v-model="search" @keyup.enter="searchSale" placeholder="Buscar")
      UButton(@click="searchSale")
        SvgIcon.size-20(name="lupa-o")

    UButton(@click="salesModal = !salesModal") Create venta
    UTable(
      :columns="columns"
      :data="salesList"
    )

    UModal(v-model:open="saleDetailModal" title="Detalle de Venta")
      template(#body)
        SaleDetail(:sale="currentSale" v-if="currentSale")

    UModal(v-model:open="salesModal" title="Crear Venta")
      template(#body)
        PanelSaleForm(
          ref="saleFormRef"
          :user-options="userOptions"
          :cfdi-options="cfdiOptions"
          :regime-options="regimeOptions"
          :loading="savingSale"
          @submit="saveSale"
        )
</template>

<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { PanelSaleRow, SatConfig, User } from "~/types";
import type { PanelSaleFormData } from "~/components/Panel/SaleForm.vue";
import { toPrice } from "~/assets/ts/utilities";

definePageMeta({
  layout: "panel",
});
const UButton = resolveComponent("UButton");

const salesModal = ref(false);
const saleDetailModal = ref(false);
const savingSale = ref(false);
const saleFormRef = ref<{ resetForm: () => void } | null>(null);

const currentSale = ref<PanelSaleRow | null>(null);

const { data: sales, refresh: refreshSales } =
  await useFetch<PanelSaleRow[]>("/api/sales");
const { data: users } = await useFetch<User[]>("/api/users");
const { data: sat } = await useAsyncData("panel-config-sat", () =>
  queryCollection("configSat").first(),
);

const salesList = computed<PanelSaleRow[]>(() => sales.value ?? []);
const userOptions = computed(() =>
  (users.value ?? [])
    .map((user) => {
      const value = String(user._id ?? user.id ?? "").trim();
      return {
        label: user.email,
        value,
      };
    })
    .filter((user) => user.value !== ""),
);

const mapSatOptions = (items: unknown) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => {
      const value =
        typeof item === "object" && item !== null
          ? (item as Record<string, unknown>).value
          : item;
      return value != null && String(value).trim() !== "";
    })
    .map((item) => {
      if (typeof item === "object" && item !== null) {
        const entry = item as Record<string, unknown>;
        const value = String(entry.value ?? "").trim();
        const label = String(entry.label ?? entry.name ?? value).trim();
        return { value, label };
      }
      const value = String(item).trim();
      return { value, label: value };
    });

const cfdiOptions = computed(() =>
  mapSatOptions((sat.value as SatConfig | null)?.usos),
);
const regimeOptions = computed(() =>
  mapSatOptions((sat.value as SatConfig | null)?.regimenes),
);

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

const search = ref("");

const searchSale = async () => {
  if (!search.value) {
    const _sales = await $fetch<PanelSaleRow[]>("/api/sales");
    sales.value = _sales ?? [];
  } else {
    const _sale = await $fetch<PanelSaleRow | null>(
      `/api/sales/${search.value}`,
    );
    sales.value = _sale ? [_sale] : [];
  }
};

const saleDetail = (sale: PanelSaleRow) => {
  currentSale.value =
    salesList.value.find((_sale) => _sale.order_no === sale.order_no) ?? null;
  saleDetailModal.value = !saleDetailModal.value;
};

const deleteSale = async (_sale: PanelSaleRow) => {
  const sale = salesList.value.find(
    (saleItem) => saleItem.order_no === _sale.order_no,
  );
  if (!sale?._id) return;

  await $fetch(`/api/sales`, {
    method: "DELETE",
    body: JSON.stringify({ id: sale._id }),
  });
  await refreshSales();
};

const toPaidStatus = (statusText: string) =>
  ["true", "1", "paid", "pagado", "completed", "complete", "success"].includes(
    statusText.trim().toLowerCase(),
  );

const saveSale = async (form: PanelSaleFormData) => {
  try {
    savingSale.value = true;

    const paid = toPaidStatus(form.sale.status);

    await $fetch("/api/order", {
      method: "POST",
      body: {
        order_no: form.sale.order_no,
        sae_order: form.sale.sae_order,
        user: {
          _id: form.sale.user,
        },
        products: [],
        payment: {
          method: paid ? "PYP" : "EFE",
          transaction: paid ? "manual-panel" : "",
          status: paid,
          installments: 1,
        },
        status: paid,
        discount: Number(form.sale.discount ?? 0),
        total: 0,
        shipping: {
          name: form.shipment.name,
          last_name: form.shipment.last_name,
          email: form.shipment.email,
          phone: form.shipment.phone,
          address: {
            street: form.shipment.address.street,
            ext_num: form.shipment.address.ext_num,
            int_num: form.shipment.address.int_num,
            neighborhood: form.shipment.address.neighborhood,
            zip: form.shipment.address.zip,
            city: form.shipment.address.city,
            state: form.shipment.address.state,
            country: "MX",
          },
          status: "pending",
          cost: 0,
        },
        billing: {
          name: form.billing.name,
          email: form.billing.email,
          phone: form.billing.phone,
          cfdi: form.billing.cfdi,
          rfc: form.billing.rfc,
          regime: form.billing.regime,
          address: {
            street: form.billing.address.street,
            ext_num: form.billing.address.ext_num,
            int_num: form.billing.address.int_num,
            neighborhood: form.billing.address.neighborhood,
            zip: form.billing.address.zip,
            city: form.billing.address.city,
            state: form.billing.address.state,
            country: "MX",
          },
        },
      },
    });

    await refreshSales();
    saleFormRef.value?.resetForm();
    salesModal.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    savingSale.value = false;
  }
};
</script>
