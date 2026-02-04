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
      p {{ terms.title }}
      span {{ terms.fecha }}
  template(#content)
    ul.terms-modal-list
      li.terms-modal-item(v-for="(section, i) in terms.sections" :key="`${Date.now()}-terms-section-${i}`")
        p {{ section.title }}
        p {{ section.content }}
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
