<template lang="pug">
nav(
  class="relative flex flex-col py-2.5 shadow-[0_4px_20px_rgba(91,91,95,0.3)] transition-[padding-top] duration-300"
  :class="searchActive ? 'pt-15 sm:pt-2.5' : ''"
)
  UContainer(class="grid grid-cols-12 items-center gap-4")
    button(
      class="relative z-2 flex size-20 items-center justify-center bg-transparent border-0 p-0 sm:hidden"
      @click="menuActive = !menuActive"
    )
      SvgIcon(class="size-20 text-[var(--color-quivi-gray)]" name="hamburguesa-o")
    NuxtLink(to="/" class="col-span-1 sm:col-span-2")
      NuxtImg(src="/img/logo.png" alt="Comercializadora Quivi Logo" width="180" height="auto")
    SearchBar(
      endpoint="/api/product/search?path=/&perPage=5"
      class="col-span-1 sm:col-span-4 min-w-[300px] sm:relative"
      :class="searchActive ? 'fixed top-0 left-1/2 z-2 w-[calc(100%-40px)] -translate-x-1/2 sm:top-auto sm:left-auto sm:w-auto sm:translate-x-0' : 'fixed -top-full left-1/2 z-2 w-[calc(100%-40px)] -translate-x-1/2 sm:top-auto sm:left-auto sm:w-auto sm:translate-x-0'"
    )
    ul(class="col-span-9 sm:col-span-6 ml-auto flex items-center justify-end")
      li(class="w-[30px] sm:hidden mr-5")
        button(
          class="cursor-pointer p-0 w-full bg-transparent border-0 text-[var(--color-text-color)] flex flex-col items-center rounded-lg overflow-hidden"
          @click="searchActive = !searchActive"
        )
          SvgIcon(class="w-[30px] h-[40px] text-[var(--color-quivi-light-red)]" name="lupa-o" v-if="!searchActive")
          SvgIcon(class="w-[30px] h-[40px] text-[var(--color-quivi-light-red)]" name="x-o" v-else)
          span(class="hidden text-[12px] font-inria text-[var(--color-text-color)] sm:inline-block sm:text-base") Busqueda
      li(class="hidden sm:flex w-[80px] mr-2.5" v-if="contactPhone")
        NuxtLink(class="whitespace-nowrap text-primary" :to="`tel:${contactPhone}`") {{ contactPhone }}
      li(class="w-[30px] sm:w-[80px] mr-2.5")
        button(
          class="cursor-pointer p-0 w-full bg-transparent border-0 text-[var(--color-text-color)] flex flex-col items-center rounded-lg overflow-hidden"
          @click="$emit('contactModal')"
        )
          SvgIcon(class="size-10 text-[var(--color-quivi-light-red)] sm:w-10 sm:h-[50px]" name="contacto-o")
          span(class="hidden text-[12px] font-inria text-[var(--color-text-color)] sm:inline-block sm:text-base") Contacto
      li(class="w-[30px] sm:w-[80px] mr-2.5")
        button(
          class="relative cursor-pointer p-0 w-full bg-transparent border-0 text-[var(--color-text-color)] flex flex-col items-center rounded-lg overflow-hidden"
          @click="toggleCart"
        )
          ClientOnly
            span(
              class="absolute z-2 top-0 right-0 w-5 h-5 bg-[var(--color-quivi-red)] rounded-full flex items-center justify-center text-[12px] text-[var(--color-white)]"
              v-if="totalCartProducts"
            ) {{ totalCartProducts }}
          SvgIcon(class="size-10 text-[var(--color-quivi-light-red)] sm:w-10 sm:h-[50px]" name="carrito-o")
          span(class="hidden text-[12px] font-inria text-[var(--color-text-color)] sm:inline-block sm:text-base") Carrito
      li(class="w-[30px] sm:w-[80px]")
        ClientOnly
          button(
            class="cursor-pointer p-0 w-full bg-transparent border-0 text-[var(--color-text-color)] flex flex-col items-center rounded-lg overflow-hidden"
            @click="$emit('loginModal')"
            v-if="!isLoggedIn"
          )
            div(class="w-full h-full flex items-center justify-center bg-gradient-to-r from-[var(--color-quivi-light-red)] to-[var(--color-quivi-red)]")
              SvgIcon(class="w-[30px] h-[40px] text-[var(--color-white)] sm:w-10 sm:h-[50px]" name="registrarsecaja-o")
            span(class="hidden w-full p-1 text-[var(--color-text-color)] sm:inline-block sm:text-base") Ingresar
          UDropdownMenu(v-else :items="panelItems" class="w-full")
            UButton(label="User" color="neutral" variant="outline" icon="i-lucide-menu")
  ul(
    class="absolute top-full left-0 w-full z-10 max-h-0 overflow-hidden rounded-b-lg bg-gradient-to-r from-[var(--color-quivi-gray)] to-[var(--color-quivi-darkest-gray)] shadow-[0_10px_10px_rgba(51,47,46,0.3)] transition-[max-height] duration-300 sm:relative sm:z-2 sm:max-h-none sm:overflow-visible sm:w-auto sm:h-auto sm:bg-none sm:shadow-none sm:flex sm:items-center sm:ml-auto sm:mb-[-50px] sm:px-5"
    :class="menuActive ? 'max-h-screen' : ''"
  )
    NavigationItem(
      v-for="(item, i) in navigation"
      :key="i"
      :item="item"
      @toggle="item.active = !Boolean(item.active)"
    )
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import type { NavigationItemModel } from "./types";

const panelItems: DropdownMenuItem[][] = [
  [
    {
      label: "Panel",
      icon: "i-lucide-dashboard",
      href: "/panel",
    },
  ],
  [
    {
      label: "Logout",
      color: "error",
      icon: "i-lucide-logout",
      onClick: () => logout(),
    },
  ],
];

const props = defineProps({
  contact: {
    type: Object,
    required: false,
    default: null,
  },
});

const { data: navigationData } = await useAsyncData("navigation", async () =>
  queryCollectionNavigation("pages", ["order"]),
);

const navigation = computed<NavigationItemModel[]>(() =>
  ((navigationData.value ?? []) as NavigationItemModel[]).sort((a, b) => {
    const orderA = a.order ?? a.children?.[0]?.order ?? 9999;
    const orderB = b.order ?? b.children?.[0]?.order ?? 9999;
    return orderA - orderB;
  }),
);

const route = ref(useRoute());
const searchActive = ref(false);
const menuActive = ref(false);

const { toggleCart, totalCartProducts } = useCart();

const { isLoggedIn, logout } = useAuth();
const contactPhone = computed(() => (props.contact as any)?.phone ?? "");

watch(
  () => route.value.name,
  () => {
    menuActive.value = false;
  },
);
</script>
