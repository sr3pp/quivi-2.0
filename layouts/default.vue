<template lang="pug">
main.default-layout
  Navigation(@contact-modal="contactModalHandler" @login-modal="loginHandler" :navigation="navigation" :contact="contact")
  Transition(name="page", mode="out-in")
    Loading(v-if="loading")
    
  NuxtPage(@cartModal="toggleCart")

  ContactModal(ref="contactModal" :social="social")
  LoginModal(ref="loginModal")
  QuiviButton(@click="openFaqs" label="FAQ's" variant="secondary" class="faq-btn")
  a.whatsapp(href="https://api.whatsapp.com/send?phone=525574763104&text=%28Comercializadora+de+Refacciones+Quivi%29+Buen+d%C3%ADa%2C+me+puedes+ayudar+d%C3%A1ndome+informaci%C3%B3n+de+refacciones%2C+gracias" target="_blank")
    svg(width="100%" height="100%" fill="white" viewBox="0 0 16 16")
      path(d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z")
  FAQModal(ref="faqModal" :faqs="faqs")
  ClientOnly
    Cart
    NotificationStack
  Footer(:social="social" :distribuidores="distribuidores" @login-modal="loginHandler")
</template>

<script lang="ts" setup>
const { toggleCart, active: cartSwitch, getCart } = useCart();

const contactModal = ref(null);
const loginModal = ref(null);
const faqModal = ref(null);
const loading = ref(false);

const [business, distribuidores, faqs, navigation, contact] = await Promise.all(
  [
    $fetch("/api/content?page=_config/business"),
    $fetch("/api/content?page=_config/distribuidores"),
    $fetch("/api/content?page=_config/faqs"),
    $fetch("/api/content/navigation"),
    $fetch("/api/content?page=_config/contact"),
  ],
);

const { social } = business;

const contactModalHandler = () => {
  (contactModal.value as any).toggleContactModal();
};

const loginHandler = () => {
  (loginModal.value as any).toggleLoginModal();
};

const openFaqs = () => {
  (faqModal.value as any).toggleFaqModal();
};

const { hook } = useNuxtApp();

hook("page:start", () => {
  loading.value = true;
});
hook("page:transition:finish", () => {
  loading.value = false;
});
hook("page:finish", () => {
  //loading.value = false;
});

watch(loading, () => {
  if (!loading.value && cartSwitch.value) {
    toggleCart();
  }
});

onMounted(() => {
  if (process.client) {
    getCart();
  }
});
</script>

<style lang="scss">
.default-layout {
  background-color: $color-white;
  overflow: hidden;

  .faq-btn,
  .whatsapp {
    position: fixed;
    bottom: pxToRem(20);
    right: pxToRem(20);
    z-index: 1000;
  }

  .whatsapp {
    bottom: pxToRem(80);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: pxToRem(35);
    background-color: #25d366;
    color: #fff;
    text-decoration: none;
    font-family: sans-serif;
    font-size: pxToRem(16);
    width: pxToRem(60);
    height: pxToRem(60);
  }

  .quivi-notification-stack {
    right: pxToRem(150);
  }
}
</style>
