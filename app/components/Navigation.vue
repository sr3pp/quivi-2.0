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
        a(class="whitespace-nowrap" :href="`tel:${contactPhone}`") {{ contactPhone }}
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
    li(
      class="group relative z-2 flex flex-col min-w-[140px] sm:mr-1"
      v-for="(item, i) in navigation"
      :class="[item.highLight ? 'text-[var(--color-text-color)]' : '', item.active ? 'is-active' : '']"
      :key="i"
    )
      div(class="relative flex")
        NuxtLink(
          class="relative z-2 flex w-full p-4 text-[var(--color-white)] sm:min-w-[130px] sm:h-auto sm:justify-center sm:p-2.5 sm:text-center sm:font-bebas sm:text-[22px] sm:leading-[1.4]"
          :to="item.path"
        )
          span {{ item.title }}
          SvgIcon(class="size-10 ml-auto sm:hidden" name="ir-o" v-if="!item.children || (item.children && !item.children.length)")
        button(
          class="ml-auto p-4 bg-transparent border-0 sm:hidden"
          @click="item.active = !Boolean(item.active)"
          v-if="item.children && item.children.length"
        )
          SvgIcon(
            class="size-10 text-[var(--color-white)] transition-transform duration-300"
            :class="item.active ? 'rotate-180' : ''"
            name="desplazamientoabajo-o"
          )
        svg(
          class="hidden sm:block absolute inset-0 z-1 w-full h-full"
          :style="{ fill: item.highLight ? 'url(#stateMenuBtnHighlight)' : 'url(#stateMenuBtn)' }"
        )
          defs
            linearGradient(id="stateMenuBtnHover" x1="0%" y1="0%" x2="0%" y2="100%")
              stop(offset="0%" stop-color="#000000")
              stop(offset="100%" stop-color="#000000")
            linearGradient(id="stateMenuBtn" x1="0%" y1="0%" x2="0%" y2="100%")
              stop(offset="0%" :stop-color="btnColor1")
              stop(offset="100%" :stop-color="btnColor2")
            linearGradient(id="stateMenuBtnHighlightHover" x1="0%" y1="0%" x2="0%" y2="100%")
              stop(offset="0%" stop-color="#E0C207")
              stop(offset="100%" stop-color="#E0C207")
            linearGradient(id="stateMenuBtnHighlight" x1="0%" y1="0%" x2="0%" y2="100%")
              stop(offset="0%" :stop-color="btnColor3")
              stop(offset="100%" :stop-color="btnColor4")
          use(href="/icons/botonmenu-o.svg#s")
      ol(
        class="flex flex-col overflow-hidden max-h-0 transition-[max-height,opacity,padding-top] duration-300 sm:absolute sm:left-0 sm:top-3.5 sm:min-w-[250px] sm:rounded-b-[18px] sm:bg-gradient-to-r sm:from-[var(--color-quivi-gray)] sm:to-[var(--color-quivi-darkest-gray)] sm:shadow-[0_10px_10px_rgba(51,47,46,0.3)] sm:group-hover:max-h-screen sm:group-hover:pt-7"
        :class="item.active ? 'max-h-screen' : ''"
        v-if="item.children && item.children.length > 1"
        role="list"
      )
        li(
          class="relative flex w-full"
          v-for="(el, e) in item.children.filter(child => child.stem !== item.stem && !child.stem.endsWith('/index'))"
          :key="e"
        )
          NuxtLink(
            class="w-full text-[var(--color-white)] text-left text-[18px] leading-[1.8] capitalize px-5 py-4 sm:px-4 sm:justify-start sm:font-inria"
            :to="el.path"
          ) {{ el.title }}
</template>

<script lang="ts" setup>
import {
  colorQuiviDarkestGray,
  colorQuiviGray,
  colorQuiviYellow,
  colorQuiviDarkYellow,
} from "~/assets/ts/tokens";

import type { DropdownMenuItem } from "@nuxt/ui";

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
  navigation: {
    type: Array,
    required: true,
  },
  contact: {
    type: Object,
    required: false,
    default: null,
  },
});

const route = ref(useRoute());
const searchActive = ref(false);
const menuActive = ref(false);

const btnColor1: string = colorQuiviGray;
const btnColor2: string = colorQuiviDarkestGray;
const btnColor3: string = colorQuiviYellow;
const btnColor4: string = colorQuiviDarkYellow;

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
