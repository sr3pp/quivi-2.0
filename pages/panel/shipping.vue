<template lang="pug">
.quivi-shipping
  SrContainer(:with-padding="true")
    .header-title
        SrText(text="Panel Envios" class="title text-center")
        SrFormInput(v-model="search" @keyup.enter="searchShipping" placeholder="Buscar")
        QuiviButton(@click="searchShipping")
          SrIcon(name="lupa-o")

    DetailTable(
      v-if="shipping"
      :headers="['order', 'name', 'createdAt', 'status', 'actions']"
      :data="shipping"
      @detail="shippDetail"
      :actions="['detail']"
      @update:data="(val) => shipping = val"
    )

    Pagination(:pagination="pagination")

  SrModal(ref="shippDetailModal" class="shipp-modal")
    template(#header)
      .shipp-modal-header
        SrText(text="Envio" class="title")
    template(#body v-if="currentShipping")
      SrGrid
        SrGridColumn(:size="{mobile: '1/2'}")
          SrText(v-if="currentShipping.sale.length" :text="`orden no. ${currentShipping.sale.at(0)._id}`" class="subtitle")
        SrGridColumn(:size="{mobile: '1/2'}")
          p.status-box 
            span {{ currentShipping.status }}
            Status(:status="currentShipping.status == 'delivered' ? 2 : currentShipping.status == 'shipping' ? 1 : 0")
        template(v-if="currentShipping.tracking")
          SrGridColumn(:size="{mobile: '1'}")
            SrText(text="Tracking" class="subtitle")
          SrGridColumn(:size="{mobile: '1/2', sm: '1/4'}")
            SrText(:text="currentShipping.tracking.store")
          SrGridColumn(:size="{mobile: '1/2', sm: '1/4'}")
            SrText(:text="currentShipping.tracking.number")
          SrGridColumn(:size="{mobile: '1/2', sm: '1/4'}")
            SrText(:text="currentShipping.tracking.url")
          SrGridColumn(:size="{mobile: '1/2', sm: '1/4'}")
            div
              QuiviButton(@click="sendTrackingMail" variant="secondary" label="Enviar al cliente" :loading="sending")
        template(v-else)
          SrGridColumn(:size="{mobile: '1'}")
            QuiviButton(variant="secondary" label="Obtener Rastreo" @click="getTracking(currentShipping.sale.at(0).sae_order)" :loading="fetching")

      br
      SrText(text="Destinatario" class="subtitle")
      SrText(:text="`${currentShipping.name} ${currentShipping.last_name}`")
      SrText(:text="currentShipping.email")
      SrText(:text="currentShipping.phone")
      SrText(v-if="currentShipping.address" :text="Object.values(currentShipping.address).filter(el => el).join(', ')")
</template>

<script lang="ts" setup>
import type { ShippmentData } from "~/types";

definePageMeta({
  layout: "panel",
});

const {
  query: { page },
} = useRoute();

const data: any = await $fetch("/api/shipping?page=" + (page || 1));
const shipping: any = ref(data.shipping);
const pagination: any = ref(data.pagination);
const shippDetailModal: any = ref(null);
const currentShipping: any = ref(null);
const fetching = ref(false);
const sending = ref(false);
const search = ref("");

const searchShipping = async () => {
  const data: any = await $fetch("/api/shipping/search?search=" + search.value);
  shipping.value = data.shipment;
  pagination.value = data.pagination;
};

const shippDetail = (_shipp: any) => {
  const shipp = shipping.value.find((el: any) => el.order === _shipp.order);
  currentShipping.value = shipp;
  shippDetailModal.value.toggle();
};

const getTracking = async (orderSae: string) => {
  fetching.value = true;
  try {
    const trackingInfo: any = await $fetch(
      "/api/shipping/get-tracking?orderId=" + orderSae,
    );
    if (trackingInfo.number) {
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

const sendTrackingMail = async () => {
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
  () => useRoute().query,
  async ({ page }) => {
    const { data }: any = await useFetch("/api/shipping?page=" + page);
    shipping.value = data.value.shipping;
    pagination.value = data.value.pagination;
  },
);
</script>

<style lang="scss" scoped>
.quivi-shipping {
  .header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: pxToRem(20);
    .sr-form-input {
      margin-left: pxToRem(20);
      padding: pxToRem(0);
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
  .status-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: pxToRem(10);
  }
  .shipp-modal {
    &-header {
      padding: pxToRem(20);
    }
  }

  .quivi-button {
    .sr-icon {
      margin: auto;
      width: pxToRem(16);
      height: pxToRem(16);
    }
  }
}
</style>
