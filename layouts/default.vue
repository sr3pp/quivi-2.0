<template lang="pug">
main.default-layout
  Navigation
  NuxtPage
  SrModal(:active="contactModal" @close="contactModal = false")
    template(#header)
      .sr-modal-header
        SrText(value="Contacto" kind="title")
    template(#body)
      .sr-modal-body
        ContactForm
  SrModal(:active="loginSw" @close="loginSw = false")
    template(#header)
      .sr-modal-header
        SrText(value="Login" kind="title")
    template(#body)
      .sr-modal-body
        Login
  ClientOnly
    Cart(:active="cartSwitch" @close="cartSwitch = false")
  Footer
</template>

<script lang="ts" setup>
const contactModal = useState("contactModal", () => false);
const cartSwitch = useState("cartSwitch", () => false);
const loginSw = useState("loginSw", () => false);
</script>

<style lang="scss">
.default-layout {
  background-color: white;
}
</style>
