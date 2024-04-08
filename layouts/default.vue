<template lang="pug">
main.default-layout
  Navigation
  Transition(name="page", mode="out-in")
    Loading(v-if="loading")
    
  NuxtPage

  ContactModal(:contactModal="contactModal" @close="contactModal = false" :social="social")
  LoginModal(:loginSw="loginSw" @close="loginSw = false")
  ClientOnly
    Cart(:active="cartSwitch" @close="cartSwitch = false")
    NotificationStack
  Footer(:social="social" :distribuidores="distribuidores")
</template>

<script lang="ts" setup>
const contactModal = useState("contactModal", () => false);
const cartSwitch = useState("cartSwitch", () => false);
const loginSw = useState("loginSw", () => false);

const loading = ref(false);

const [business, _distribuidores] = await Promise.all([
  $fetch("/api/content?page=_config/business"),
  $fetch("/api/content?page=_config/distribuidores"),
]);

const { social } = business;
const { distribuidores } = _distribuidores;

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
