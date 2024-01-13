<template lang="pug">
main.default-layout
  Navigation
  Transition(name="page", mode="out-in")
    Loading(v-if="loading")
    
  NuxtPage

  SrModal(:active="contactModal" @close="contactModal = false")
    template(#header)
      .sr-modal-header
        SrText(value="Contacto" class="title")
    template(#body)
      .sr-modal-body
        ContactForm
  SrModal(:active="loginSw" @close="loginSw = false")
    template(#header)
      .sr-modal-header
        SrText(value="Login" class="title")
    template(#body)
      .sr-modal-body
        Login
  ClientOnly
    Cart(:active="cartSwitch" @close="cartSwitch = false")
    NotificationStack
  Footer
</template>

<script lang="ts" setup>
const contactModal = useState("contactModal", () => false);
const cartSwitch = useState("cartSwitch", () => false);
const loginSw = useState("loginSw", () => false);

const loading = ref(false);

const { hook } = useNuxtApp();

hook("page:start", () => {
  loading.value = true;
});
hook("page:transition:finish", () => {
  loading.value = false;
});
</script>

<style lang="scss">
.default-layout {
  background-color: white;
}
</style>
