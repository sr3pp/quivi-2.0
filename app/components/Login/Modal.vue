<script lang="ts" setup>
const modalSw = ref(false);

const toggleLoginModal = () => {
  modalSw.value = !modalSw.value;
};

defineExpose({
  toggleLoginModal,
});
</script>

<template lang="pug">
UModal.quivi-modal-login(v-model:open="modalSw")
    template(#header)
      .sr-modal-header
        p.title Login
    template(#content)
      .sr-modal-body
        LoginForm

</template>

<style lang="scss">
.quivi-modal-login {
  .sr-modal-container {
    max-width: pxToRem(400) !important;
  }
  .sr-modal-content {
    min-width: inherit !important;
  }
  .sr-modal-close {
    z-index: 3;
  }
  .sr-modal-body {
    max-height: inherit;
    overflow: hidden;
    border-radius: pxToRem(10);
  }
}
</style>
