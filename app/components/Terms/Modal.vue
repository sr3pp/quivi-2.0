<script lang="ts" setup>
import type { ConfigEntry } from "~/types";

const modalSw = ref(false);

const toggleTermsModal = () => {
  modalSw.value = !modalSw.value;
};

defineExpose({
  toggleTermsModal,
});

const config = inject("config") as ConfigEntry[];

const terms = computed(() => {
  const item = config.find((c) => c.stem === "config/terms");
  return {
    title: item?.meta.title ?? "",
    fecha: item?.meta.fecha ?? "",
    sections: item?.meta.sections ?? [],
  };
});
</script>

<template lang="pug">
UModal(v-model:open="modalSw")
  template(#header)
    p.font-bebas.text-3xl {{ terms.title }}
    span {{ terms.fecha }}
  template(#body)
    Terms(:terms="terms.sections")
</template>
