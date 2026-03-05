<template lang="pug">
  div
    UContainer(:with-padding="true")
      .header-title
          p Panel Envios
          UInput(v-model="search" @keyup.enter="searchShipping" placeholder="Buscar")
          UButton(@click="searchShipping")
            SvgIcon.size-10(name="lupa-o")

      UTable(
        v-if="shipping"
        :columns="columns"
        :data="shipping"
      )

      div(class="mt-5")
        UPagination(
          v-model="pageModel"
          :items-per-page="itemsPerPage"
          :total="pagination.total || 0"
          @update:page="handlePage"
          color="primary"
        )

    UModal(ref="shippDetailModal" class="shipp-modal" title="Detalle de Envio")
      template(#header)
        .shipp-modal-header
          p Envio
      template(#body v-if="currentShipping")
        UPageGrid
          div(class="col-span-'")
            p(v-if="currentShipping.sale.length") {{`orden no. ${currentShipping.sale.at(0)._id}`}}
          div(class="col-span-2")
            p.status-box 
              span {{ currentShipping.status }}
              UBadge(:color="currentShipping.status == 'delivered' ? 'primary' : currentShipping.status == 'shipping' ? 'warning' : 'error'" :label="`Envio: ${currentShipping.status}`")
          template(v-if="currentShipping.tracking.number")
            div(class="col-span-1 sm:col-span-2")
              p Tracking
            div(class="col-span-1/2 sm:col-span-1/4")
              p {{currentShipping.tracking.store}}
            div(class="col-span-1/2 sm:col-span-1/4")
              p {{currentShipping.tracking.number}}
            div(class="col-span-1/2 sm:col-span-1/4")
              p {{currentShipping.tracking.url}}
            div(class="col-span-1/2 sm:col-span-1/4")
              div
                UButton(@click="sendTrackingMail" variant="secondary" label="Enviar al cliente" :loading="sending")
          template(v-else)
            UFormField(class="col-span-1 sm:col-span-1/3" label="Numero de Rastreo")
              UInput(v-model="newTracking.number")
            UFormField(class="col-span-1 sm:col-span-1/3" label="Tienda")
              UInput(v-model="newTracking.store")
            UFormField(class="col-span-1 sm:col-span-1/3" label="Url")
              UInput(v-model="newTracking.url")
            div(class="col-span-1" class="flex-row justify-between" style="--flex-direction-sm: row")
              UButton(variant="secondary" label="Guardar" @click="saveTracking()" :loading="fetching")
              UButton(variant="secondary" label="Obtener Rastreo" @click="getTracking(currentShipping.sale.at(0).sae_order)" :loading="fetching")

        br
        p Destinatario
        p {{`${currentShipping.name} ${currentShipping.last_name}`}}
        p {{currentShipping.email}}
        p {{currentShipping.phone}}
        p(v-if="currentShipping.address") {{Object.values(currentShipping.address).filter(el => el).join(', ')}}
</template>

<script lang="ts" setup>
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type {
  PanelSalesModal,
  PanelShippingDetail,
  PanelShippingListResponse,
  PanelShippingRow,
  ShippingTracking,
} from "~/types";
definePageMeta({
  layout: "panel",
});

const route = useRoute();
const router = useRouter();
const pageQuery = computed(() => (route.query.page as string) || "1");

const UButton = resolveComponent("UButton");

const data = await $fetch<PanelShippingListResponse>(
  "/api/shipping?page=" + pageQuery.value,
);
const shipping = ref<PanelShippingDetail[]>(data.shipping);
const pagination = ref<{ total?: number; perPage?: number }>(data.pagination);
const pageModel = ref(Number(pageQuery.value));
const itemsPerPage = computed(() => Number(pagination.value.perPage ?? 10));
const shippDetailModal = ref<boolean>(false);
const currentShipping = ref<PanelShippingDetail | null>(null);
const fetching = ref(false);
const sending = ref(false);
const search = ref("");
const newTracking = ref({
  number: "",
  store: "",
  url: "",
});

const columns: TableColumn<PanelShippingRow>[] = [
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) =>
      `${row.original.name ?? ""} ${row.original.last_name ?? ""}`.trim(),
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
    accessorKey: "status",
    header: "Status",
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
          onClick: () => shippDetail(row.original),
        }),
      ]),
    meta: {
      class: {
        td: "text-right",
      },
    },
  },
];

const searchShipping = async () => {
  const response = await $fetch<{
    shipment: PanelShippingDetail[];
    pagination: Record<string, unknown>;
  }>("/api/shipping/search?search=" + search.value);
  shipping.value = response.shipment;
  pagination.value = response.pagination;
};

const shippDetail = (_shipp: PanelShippingRow) => {
  const shipp = shipping.value.find((el) => el.order === _shipp.order);
  if (!shipp) return;
  currentShipping.value = shipp;
  currentShipping.value.tracking = shipp.tracking || {};
  shippDetailModal.value = true;
};

const getTracking = async (orderSae: string) => {
  fetching.value = true;
  try {
    const trackingInfo = await $fetch<ShippingTracking>(
      "/api/shipping/get-tracking?orderId=" + orderSae,
    );
    if (trackingInfo.number && currentShipping.value) {
      currentShipping.value.tracking = trackingInfo;
      currentShipping.value.status = "shipping";
      fetching.value = false;
      await $fetch("/api/shipping", {
        method: "PUT",
        body: currentShipping.value,
      });
    }
  } catch (error) {
    fetching.value = false;
    console.log(error);
  }
};

const saveTracking = async () => {
  if (!currentShipping.value) return;
  currentShipping.value.tracking = newTracking.value;
  currentShipping.value.status = "shipping";
  await $fetch("/api/shipping", {
    method: "PUT",
    body: currentShipping.value,
  });
  newTracking.value = {
    number: "",
    store: "",
    url: "",
  };
};

const sendTrackingMail = async () => {
  if (!currentShipping.value) return;
  sending.value = true;
  await $fetch("/api/send-mail", {
    method: "POST",
    body: {
      context: currentShipping.value.tracking,
      template: "shipping",
      to: currentShipping.value.email,
      subject: "Numero de Rastero Quivi.mx",
    },
  });
  sending.value = false;
};

watch(
  () => route.query,
  async ({ page }) => {
    const currentPage = (page as string) || "1";
    const { data } = await useFetch<PanelShippingListResponse>(
      "/api/shipping?page=" + currentPage,
    );
    shipping.value = data.value?.shipping ?? [];
    pagination.value = data.value?.pagination ?? {};
    pageModel.value = Number(currentPage);
  },
);

const handlePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      page,
    },
  });
};
</script>
