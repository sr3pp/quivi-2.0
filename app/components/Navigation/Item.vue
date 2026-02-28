<template lang="pug">
li(class="group relative z-2 flex flex-col min-w-[140px] sm:mr-1")
  div(class="relative flex")
    NuxtLink(
      class="relative z-2 flex w-full p-4 sm:min-w-[130px] sm:h-auto sm:justify-center sm:p-2.5 sm:text-center sm:font-bebas sm:text-[22px] sm:leading-[1.4]"
      :class="[item.path === '/tienda' ? 'text-quivi-dark' : 'text-[var(--color-white)]', item.active ? 'is-active' : '']"
      :to="item.path"
    )
      span {{ item.title }}
      SvgIcon(
        class="size-10 ml-auto sm:hidden"
        name="ir-o"
        v-if="!hasChildren"
      )
    button(
      class="ml-auto p-4 bg-transparent border-0 sm:hidden"
      @click="$emit('toggle')"
      v-if="hasChildren"
    )
      SvgIcon(
        class="size-10 text-[var(--color-white)] transition-transform duration-300"
        :class="item.active ? 'rotate-180' : ''"
        name="desplazamientoabajo-o"
      )
    svg(
      class="hidden sm:block absolute inset-0 z-1 w-full h-full"
      :style="{ fill: item.path === '/tienda' ? 'url(#stateMenuBtnHighlight)' : 'url(#stateMenuBtn)' }"
    )
      defs
        linearGradient(id="stateMenuBtnHover" x1="0%" y1="0%" x2="0%" y2="100%")
          stop(offset="0%" stop-color="#000000")
          stop(offset="100%" stop-color="#000000")
        linearGradient(id="stateMenuBtn" x1="0%" y1="0%" x2="0%" y2="100%")
          stop(offset="0%" :stop-color="btnColor1")
          stop(offset="100%" :stop-color="btnColor2")
        linearGradient(id="stateMenuBtnHighlightHover" x1="0%" y1="0%" x2="0%" y2="100%")
          stop(offset="0%" :stop-color="btnHighlight1")
          stop(offset="100%" :stop-color="btnHighlight2")
        linearGradient(id="stateMenuBtnHighlight" x1="0%" y1="0%" x2="0%" y2="100%")
          stop(offset="0%" :stop-color="btnColor3")
          stop(offset="100%" :stop-color="btnColor4")
      use(href="/icons/botonmenu-o.svg#s")
  NavigationSubmenu(
    :children="item.children"
    :parent-stem="item.stem"
    :is-active="Boolean(item.active)"
  )
</template>

<script lang="ts" setup>
import {
  colorQuiviDarkestGray,
  colorQuiviGray,
  colorQuiviYellow,
  colorQuiviDarkYellow,
} from "~/assets/ts/tokens";
import type { NavigationItemModel } from "./types";

defineEmits<{
  toggle: [];
}>();

const props = defineProps<{
  item: NavigationItemModel;
}>();

const btnColor1: string = colorQuiviGray;
const btnColor2: string = colorQuiviDarkestGray;
const btnColor3: string = colorQuiviYellow;
const btnColor4: string = colorQuiviDarkYellow;

const btnHighlight1: string = colorQuiviDarkYellow;
const btnHighlight2: string = colorQuiviYellow;

const hasChildren = computed(() =>
  Boolean(props.item.children && props.item.children.length),
);
</script>
