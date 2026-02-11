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
UModal.terms-modal(v-model:open="modalSw")
  template(#header)
    .terms-modal-header
      p.font-bebas.text-3xl {{ terms.title }}
      span {{ terms.fecha }}
  template(#body)
    Terms(:terms="terms.sections")
</template>

<style scoped lang="scss">
.terms-modal {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: pxToRem(20);
  }
  &-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: pxToRem(20);
  }
  &-item {
    .sr-text {
      &.subtitle {
        margin-bottom: pxToRem(10);
      }
    }
  }
}
</style>
