<template lang="pug">
nav.quivi-navbar(:class="{'active-search': searchActive}")
  SrContainer
    button.quivi-navbar-burguer(@click="menuActive = !menuActive")
      SrIcon(name="hamburguesa-o")
    NuxtLink.logo(to="/")
      SrPicture(src="/img/logo.png" alt="Comercializadora Quivi Logo" width="180" height="auto")
    SearchBar(endpoint="/api/product/search?path=/&perPage=5")
    ul.quivi-navbar-list
      li.quivi-navbar-list-item(class="sm:hidden")
        button(@click="searchActive = !searchActive")
          SrIcon(name="lupa-o" v-if="!searchActive")
          SrIcon(name="x-o" v-else)
          span Busqueda
      li.quivi-navbar-list-item.hidden(class="sm:flex")
        a(:href="`tel:${contact.phone}`") {{ contact.phone }}
      li.quivi-navbar-list-item
        button(@click="$emit('contactModal')")
          SrIcon(name="contacto-o")
          span Contacto
      li.quivi-navbar-list-item
        button.cart-btn(@click="$emit('cartModal')")
          ClientOnly
            span.cart-counter(v-if="productsLength") {{ productsLength }}
          SrIcon(name="carrito-o")
          span Carrito
      li.quivi-navbar-list-item
        button.variant-red(@click="$emit('loginModal')")
            .icon-container
              SrIcon(name="registrarsecaja-o")
            span Ingresar
  ul.quivi-navbar-menu(:class="{active: menuActive}")
    li.quivi-navbar-item(v-for="(item, i) in navigation" :class="{active: item.active, 'highlight': item.highLight}" :key="i")
      .link-container  
        NuxtLink(:to="item.url")
          span {{ item.label }}
          SrIcon(name="ir-o" v-if="!item.items || (item.items && !item.items.length)")
        button.collapse(@click="item.active = !Boolean(item.active)" v-if="item.items && item.items.length")
          SrIcon(name="desplazamientoabajo-o")
      
        svg.bg
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
      ol.quivi-navbar-submenu(v-if="item.items && item.items.length" role="list")
        li.quivi-navbar-submenu-item(v-for="(el, e) in item.items" :key="e")
          NuxtLink(:to="el.url") {{ el.label }}
</template>

<script lang="ts" setup>
import {
  colorQuiviDarkestGray,
  colorQuiviGray,
  colorQuiviYellow,
  colorQuiviDarkYellow,
} from "~/assets/ts/tokens";

defineProps({
  navigation: {
    type: Array,
    required: true,
  },
  contact: {
    type: Object,
    required: true,
  },
});

const route = ref(useRoute());
const searchActive = ref(false);
const menuActive = ref(false);

const btnColor1: string = colorQuiviGray;
const btnColor2: string = colorQuiviDarkestGray;
const btnColor3: string = colorQuiviYellow;
const btnColor4: string = colorQuiviDarkYellow;

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
  subtotal: 0,
  shipping: {
    costo: 0,
    limite: 0,
  },
});

const productsLength = computed(() => {
  let total = 0;
  cart.value.products.forEach((product: any) => {
    total += Number(product.qty);
  });

  return total;
});

watch(
  () => route.value.name,
  () => {
    menuActive.value = false;
  },
);
</script>

<style lang="scss" scoped>
.quivi-navbar {
  padding-top: pxToRem(10);
  padding-bottom: pxToRem(10);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 pxToRem(4) pxToRem(20) rgba($color-quivi-dark-gray, 0.3);
  transition: padding-top 0.35s ease;

  &.active-search {
    @media (max-width: $breakpoint-sm) {
      padding-top: pxToRem(60);

      .quivi-searchbar {
        top: 0;
      }
    }
  }
  .sr-container {
    display: flex;
    align-items: center;
    > * {
      &:not(:last-child) {
        margin-right: pxToRem(20);
      }
    }
  }

  &-burguer {
    background: none;
    border: none;
    padding: 0;
    width: pxToRem(30);
    height: pxToRem(30);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;

    .sr-icon {
      width: pxToRem(30);
      height: pxToRem(30);
      color: $color-quivi-gray;
    }

    @media (min-width: $breakpoint-sm) {
      display: none;
    }
  }

  .logo {
    width: 20%;
    min-width: pxToRem(100);

    @media (min-width: $breakpoint-sm) {
      min-width: pxToRem(180);
      margin: 0 !important;
      padding-right: pxToRem(20);
    }
  }

  .quivi-searchbar {
    display: flex;
    position: fixed;
    flex-shrink: 1;
    top: -100%;
    left: 50%;
    z-index: 2;
    width: calc(100% - pxToRem(40));
    transform: translateX(-50%);
    transition: top 0.35s ease;

    @media (min-width: $breakpoint-sm) {
      position: relative;
      min-width: pxToRem(300);
      width: 40%;
      transform: none;
      left: inherit;
    }
  }

  &-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 10;
    max-height: 0;
    overflow: hidden;
    border-bottom-left-radius: pxToRem(8);
    border-bottom-right-radius: pxToRem(8);
    background: linear-gradient(
      to right,
      $color-quivi-gray,
      $color-quivi-darkest-gray
    );
    box-shadow: 0 pxToRem(10) pxToRem(10) rgba($color-black, 0.3);
    transition: max-height 0.35s ease;

    &.active {
      max-height: 100vh;
    }

    @media (min-width: $breakpoint-sm) {
      overflow: visible;
      max-height: inherit;
      width: auto;
      height: auto;
      background-color: transparent;
      background: none;
      box-shadow: none;
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-bottom: pxToRem(-55);
      padding-left: pxToRem(20);
      padding-right: pxToRem(20);
    }
  }

  &-list {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &-item {
      width: pxToRem(30);
      a {
        white-space: nowrap;
      }
      button {
        cursor: pointer;
        padding: 0;
        width: 100%;
        background: none;
        border: none;
        color: $color-text-color;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: pxToRem(8);
        overflow: hidden;

        span {
          display: none;
          color: $color-text-color;
          font-size: pxToRem(12);
          font-family: Inria;
        }

        &.variant-red {
          .icon-container {
            background: linear-gradient(
              to right,
              $color-quivi-light-red,
              $color-quivi-red
            );
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .sr-icon {
              color: $color-white;
            }
          }
          span {
            width: 100%;
            padding: pxToRem(4);
            color: $color-text-color;
          }
        }

        .sr-icon {
          width: pxToRem(30);
          height: pxToRem(40);
          color: $color-quivi-light-red;
        }
      }

      .cart {
        &-btn {
          position: relative;
          display: flex;
        }
        &-counter {
          position: absolute;
          z-index: 2;
          top: 0;
          right: 0;
          width: pxToRem(20);
          height: pxToRem(20);
          background-color: $color-quivi-red;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: pxToRem(12);
          color: $color-white;
        }
      }

      &.hidden {
        display: none !important;
      }

      &:not(:last-child) {
        margin-right: pxToRem(20);
      }

      @media (min-width: $breakpoint-sm) {
        width: pxToRem(80);
        button {
          span {
            display: inline-block;
            font-size: pxToRem(16);
          }

          .sr-icon {
            width: pxToRem(40);
            height: pxToRem(50);
          }
        }
        &.sm\:hidden {
          display: none;
        }
        &.sm\:flex {
          display: flex !important;
        }

        &:not(:last-child) {
          margin-right: pxToRem(10);
        }
      }
    }
  }

  &-item {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
    min-width: pxToRem(170);

    &.highlight {
      a {
        color: $color-text-color;
      }

      svg.bg {
        fill: url(#stateMenuBtnHighlight);
      }

      &:hover,
      &:has(.router-link-active) {
        svg.bg {
          fill: url(#stateMenuBtnHighlightHover);
        }
      }
    }

    &:not(:last-child) {
      &::after {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        content: "";
        width: 95%;
        height: pxToRem(2);
        border-radius: 100%;
        background: linear-gradient(
          to right,
          $color-quivi-gray,
          $color-white,
          $color-quivi-gray
        );
      }

      @media (min-width: $breakpoint-sm) {
        &::after {
          display: none;
        }
      }
    }

    .link-container {
      display: flex;
      position: relative;
    }
    .collapse {
      background: none;
      border: none;
      margin-left: auto;
      padding: pxToRem(16);

      .sr-icon {
        width: pxToRem(25);
        height: pxToRem(25);
        color: $color-white;
        transition: transform 0.35s ease;
      }

      @media (min-width: $breakpoint-sm) {
        display: none;
      }
    }

    a {
      display: flex;
      width: 100%;
      color: $color-white;
      padding: pxToRem(16);

      .sr-icon {
        width: pxToRem(25);
        height: pxToRem(25);
        margin-left: auto;
      }

      @media (min-width: $breakpoint-sm) {
        .sr-icon {
          display: none;
        }
        &::after {
          display: none;
        }
      }
    }
    .bg {
      display: none;
    }

    &.active {
      .collapse {
        .sr-icon {
          transform: rotate(180deg);
        }
      }

      .quivi-navbar-submenu {
        max-height: 100vh;
      }
    }

    @media (min-width: $breakpoint-sm) {
      &:not(:last-child) {
        margin-right: pxToRem(20);
      }

      &:hover {
        z-index: 3;
        .bg {
          fill: url(#stateMenuBtnHover);
        }

        .quivi-navbar-submenu {
          max-height: 100vh;
          padding-top: pxToRem(28);
        }
      }

      a {
        padding: pxToRem(10);
        text-align: center;
        height: auto;
        color: $color-white;
        min-width: pxToRem(130);
        position: relative;
        z-index: 2;
        font-family: Bebas;
        font-size: pxToRem(26);
        line-height: 1.4;
        justify-content: center;

        span {
          font-family: inherit;
        }

        &.router-link-active {
          + svg {
            fill: url(#stateMenuBtnHover);
          }
        }
      }

      .bg {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        fill: url(#stateMenuBtn);
      }
    }
  }

  &-submenu {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 0;
    opacity: 1;

    @media (min-width: $breakpoint-sm) {
      padding-top: 0;
      z-index: 0;
      left: 0;
      position: absolute;
      top: pxToRem(14);
      min-width: pxToRem(250);
      box-shadow: 0 pxToRem(10) pxToRem(10) rgba($color-black, 0.3);
      background: linear-gradient(
        to right,
        $color-quivi-gray,
        $color-quivi-darkest-gray
      );
      border-bottom-left-radius: pxToRem(18);
      border-bottom-right-radius: pxToRem(18);
    }

    transition:
      max-height 0.35s ease,
      opacity 0.35s ease,
      padding-top 0.35s ease;

    &-item {
      width: 100%;
      display: flex;
      position: relative;

      a {
        width: 100%;
        font-family: Inria;
        font-size: pxToRem(18);
        height: auto;
        line-height: 1.8;
        text-transform: capitalize;
        text-align: left;
        padding-right: pxToRem(20);
        padding-left: pxToRem(20);
      }

      &:not(:last-child) {
        &::after {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          content: "";
          width: 95%;
          height: pxToRem(2);
          border-radius: 100%;
          background: linear-gradient(
            to right,
            $color-quivi-gray,
            $color-white,
            $color-quivi-gray
          );
        }
      }

      &:hover {
        a {
          color: $color-quivi-darkest-gray;
        }
      }

      @media (min-width: $breakpoint-sm) {
        a {
          padding-left: pxToRem(16);
          padding-right: pxToRem(16);
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>
