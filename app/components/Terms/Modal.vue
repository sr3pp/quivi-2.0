<script lang="ts" setup>
import type { ConfigEntry } from "~/types";

const modalSw = ref(false);

const toggleTermsModal = () => {
  modalSw.value = !modalSw.value;
};

defineExpose({
  toggleTermsModal,
});

const { data: terms } = await useAsyncData("config-terms", () => queryCollection("configTerms").first());
</script>

<template lang="pug">
UModal(v-model:open="modalSw")
  template(#header)
    p.font-bebas.text-3xl {{ terms.title }}
    span {{ terms.fecha }}
  template(#body)
    Terms(:terms="terms.sections")
</template>
