<script lang="ts" setup>
const modal = ref(null);

const toggleTermsModal = () => {
  (modal.value as any).toggle();
};

defineExpose({
  toggleTermsModal,
});

const terms = await $fetch("/api/content?page=_config/terms");
</script>

<template lang="pug">
SrModal.terms-modal(ref="modal")
  template(#header)
    .terms-modal-header
      SrText(:text="terms.title" class="title")
      span {{ terms.fecha }}
  template(#body)
    ul.terms-modal-list
      li.terms-modal-item(v-for="(section, i) in terms.sections" :key="`${Date.now()}-terms-section-${i}`")
        SrText(:text="section.title" class="subtitle")
        SrText(:text="section.content")
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
