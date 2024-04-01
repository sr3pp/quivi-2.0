<script lang="ts" setup>
defineProps({
  loginSw: {
    type: Boolean,
    default: false,
  },
});
</script>

<template lang="pug">
SrModal.quivi-modal-login(:active="loginSw" @close="loginSw = false")
    template(#header)
      .sr-modal-header
        SrText(value="Login" class="title")
    template(#body)
      .sr-modal-body
        LoginForm

</template>

<style lang="scss">
.quivi-modal-login {
  .sr-modal-content {
    max-width: pxToRem(400) !important;
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
