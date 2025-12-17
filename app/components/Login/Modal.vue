<script lang="ts" setup>
const loginModal = ref(null);

const toggleLoginModal = () => {
  (loginModal.value as any).toggle();
};

defineExpose({
  toggleLoginModal,
});
</script>

<template lang="pug">
SrModal.quivi-modal-login(ref="loginModal")
    template(#header)
      .sr-modal-header
        SrText(value="Login" class="title")
    template(#body)
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
