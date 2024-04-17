<template lang="pug">
main.default-layout
  Navigation(@contact-modal="contactModalHandler" @login-modal="loginHandler" @cart-modal="cartHandler")
  Transition(name="page", mode="out-in")
    Loading(v-if="loading")
    
  NuxtPage

  ContactModal(ref="contactModal" :social="social")
  LoginModal(ref="loginModal")
  ClientOnly
    Cart(:active="cartSwitch" @close="cartSwitch = false")
    NotificationStack
  Footer(:social="social" :distribuidores="distribuidores" @login-modal="loginHandler" @cart-modal="cartHandler")
</template>

<script lang="ts" setup>
const cartSwitch = ref(false);

const contactModal = ref(null);
const loginModal = ref(null);
const loading = ref(false);

const [business, _distribuidores] = await Promise.all([
  $fetch("/api/content?page=_config/business"),
  $fetch("/api/content?page=_config/distribuidores"),
]);

const { social } = business;
const { distribuidores } = _distribuidores;

const contactModalHandler = () => {
  (contactModal.value as any).toggleContactModal();
};

const loginHandler = () => {
  (loginModal.value as any).toggleLoginModal();
};

const cartHandler = () => {
  cartSwitch.value = !cartSwitch.value;
};

const { hook } = useNuxtApp();

hook("page:start", () => {
  loading.value = true;
});
hook("page:transition:finish", () => {
  loading.value = false;
  cartSwitch.value = false;
});
hook("page:finish", () => {
  loading.value = false;
  cartSwitch.value = false;
});
</script>

<style lang="scss">
.default-layout {
  background-color: $color-white;
  overflow: hidden;
}
</style>
