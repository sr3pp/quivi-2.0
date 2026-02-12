<script lang="ts" setup>
const modalSw = ref(false);

const toggleTermsModal = () => {
  modalSw.value = !modalSw.value;
};

defineExpose({
  toggleTermsModal,
});

const terms = await $fetch("/api/content?page=_config/terms");
</script>

<template lang="pug">
UModal(v-model:open="modalSw")
  template(#header)
    p.font-bebas.text-3xl {{ terms.title }}
    span {{ terms.fecha }}
  template(#body)
    Terms(:terms="terms.sections")
</template>
