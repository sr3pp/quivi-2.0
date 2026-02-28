<script lang="ts" setup>
import type { ConfigEntry } from "~/types";

const { toggleCart, active: cartSwitch, getCart } = useCart();

const contactModal = ref(null);
const loginModal = ref(null);
const faqModal = ref(null);
const termsModal = ref(null);
const loading = ref(false);

const toConfigEntry = (
  stem: string,
  item: Record<string, unknown> | null | undefined,
): ConfigEntry => {
  const meta = ((item?.meta as Record<string, unknown> | undefined) ??
    (item?.data as Record<string, unknown> | undefined) ??
    item ??
    {}) as Record<string, unknown>;

  return {
    stem,
    meta,
    ...meta,
  };
};

const { data } = await useAsyncData("main-data", async () => {
  const navigation = await queryCollectionNavigation("pages", ["order"]);
  const [
    business,
    distribuidores,
    faqs,
    contact,
    shipping,
    sat,
    terms,
    estados,
    promotions,
    comercios,
  ] = await Promise.all([
    queryCollection("configBusiness").first(),
    queryCollection("configDistribuidores").first(),
    queryCollection("configFaqs").first(),
    queryCollection("configContact").first(),
    queryCollection("configShipping").first(),
    queryCollection("configSat").first(),
    queryCollection("configTerms").first(),
    queryCollection("configEstados").first(),
    queryCollection("configPromotions").first(),
    queryCollection("configComercios").first(),
  ]);

  const config = [
    toConfigEntry("config/business", business as Record<string, unknown> | null),
    toConfigEntry(
      "config/distribuidores",
      distribuidores as Record<string, unknown> | null,
    ),
    toConfigEntry("config/faqs", faqs as Record<string, unknown> | null),
    toConfigEntry("config/contact", contact as Record<string, unknown> | null),
    toConfigEntry("config/shipping", shipping as Record<string, unknown> | null),
    toConfigEntry("config/sat", sat as Record<string, unknown> | null),
    toConfigEntry("config/terms", terms as Record<string, unknown> | null),
    toConfigEntry("config/estados", estados as Record<string, unknown> | null),
    toConfigEntry(
      "config/promotions",
      promotions as Record<string, unknown> | null,
    ),
    toConfigEntry("config/comercios", comercios as Record<string, unknown> | null),
  ];

  return {
    navigation,
    config
  };
});

provide("config", data.value?.config ?? []);

const navigation = computed(() =>
  (data.value?.navigation ?? []).sort((a: any, b: any) => {
    let orderA = a.order ?? a.children?.[0]?.order ?? 9999;
    let orderB = b.order ?? b.children?.[0]?.order ?? 9999;
    return (orderA as number) - (orderB as number);
  }),
);

const business = computed(() => {
  const config = data.value?.config ?? [];
  return config.find((item: any) => item.stem === "config/business");
});
const distribuidores = computed(() => {
  const config = data.value?.config ?? [];
  return config.find((item: any) => item.stem === "config/distribuidores");
});
const faqs = computed(() => {
  const config = data.value?.config ?? [];
  return config.find((item: any) => item.stem === "config/faqs");
});
const contact = computed(() => {
  const config = data.value?.config ?? [];
  return config.find((item: any) => item.stem === "config/contact");
});

const social = computed(
  () =>
    (business.value?.meta?.social ?? [])
);

const faqsContent = computed(() => faqs.value?.meta?.faqs ?? []);

const distribuidoresContent = computed(
  () => distribuidores.value?.meta?.distribuidores ?? [],
);
const contactContent = computed(() => contact.value?.meta?.content ?? null);

const contactModalHandler = () => {
  (contactModal.value as any).toggleContactModal();
};

const loginHandler = () => {
  (loginModal.value as any).toggleLoginModal();
};

const openFaqs = () => {
  (faqModal.value as any).toggleFaqModal();
};

const termsModalHandler = () => {
  (termsModal.value as any).toggleTermsModal();
};

const { hook } = useNuxtApp();

hook("page:start", () => {
  loading.value = true;
});
hook("page:transition:finish", () => {
  loading.value = false;
});

watch(loading, () => {
  if (!loading.value && cartSwitch.value) {
    toggleCart();
  }
});

onMounted(() => {
  if (process.client) {
    getCart();
    loading.value = false;
  }
});
</script>

<template lang="pug">
UApp(tag="main")
  Navigation(@contact-modal="contactModalHandler" @login-modal="loginHandler" :navigation="navigation" :contact="contactContent")
  Transition(name="page", mode="out-in")
    Loading(v-if="loading")
    
  NuxtPage

  ContactModal(ref="contactModal" :social="social")
  LoginModal(ref="loginModal")
  UButton(
    @click="openFaqs"
    label="FAQ's"
    color="primary"
    class="fixed bottom-5 right-5 z-[1000]"
  )
  a(
    href="https://api.whatsapp.com/send?phone=525574763104&text=%28Comercializadora+de+Refacciones+Quivi%29+Buen+d%C3%ADa%2C+me+puedes+ayudar+d%C3%A1ndome+informaci%C3%B3n+de+refacciones%2C+gracias"
    target="_blank"
    class="fixed bottom-20 right-5 z-[1000] flex size-16 items-center justify-center rounded-[35px] bg-[#25d366] text-[16px] text-[var(--color-white)] no-underline"
  )
    svg(width="100%" height="100%" fill="white" viewBox="0 0 16 16")
      path(d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z")
  FAQModal(ref="faqModal" :faqs="faqsContent")
  TermsModal(ref="termsModal")
  ClientOnly
    Cart
  Footer(:social="social" :distribuidores="distribuidoresContent" @login-modal="loginHandler" @terms-modal="termsModalHandler")
</template>
