<template lang="pug">
.quivi-shipping
  SrContainer(:with-padding="true")
    SrText(text="Panel Envios" class="title" alignment="center")

    table
      thead
        tr
          th order
          th name
          th date
          th status
          th actions
      tbody 
        template(v-for="(shipp, i) in shipping" :key="shipp._id")
          tr(v-if="shipp.sale.at(0)")
            td {{ shipp.sale.at(0).sae_order }}
            td {{ shipp.name }}
            td {{ shipp.createdAt }}
            td
              span.status-box 
                | {{ shipp.status }}
                Status(:status="shipp.status == 'delivered' ? 2 : shipp.status == 'shipping' ? 1 : 0")
            td
              QuiviButton(@click="shippDetail(shipp)" variant="secondary")
                SrIcon(name="edit-o")

    Pagination(:pagination="pagination")

  SrModal(ref="shippDetailModal" class="shipp-modal")
    template(#header)
      .shipp-modal-header
        SrText(text="Envio" class="title")
    template(#body v-if="currentShipping")
      SrGrid
        SrGridColumn(:size="{mobile: '1/2'}")
          SrText(:text="`orden no. ${currentShipping.sale.at(0)._id}`" class="subtitle")
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
      SrText(:text="Object.values(currentShipping.address).filter(el => el).join(', ')")
</template>

<script lang="ts" setup>
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

const shippDetail = (shipp: any) => {
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
  table {
    margin: auto;
    margin-bottom: pxToRem(20);
    td {
      min-width: pxToRem(150);
      text-align: center;
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
