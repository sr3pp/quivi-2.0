import { colorDarkGray } from '~/assets/ts/tokens';
<template lang="pug">
nav.quivi-navbar(:class="{'active-search': searchActive}")
  SrContainer
    button.quivi-navbar-burguer(@click="menuActive = !menuActive")
      SrIcon(value="hamburguesa-o")
    NuxtLink.logo(to="/")
      SrImg(src="/img/logo.png" alt="Comercializadora Quivi Logo" width="180" height="auto")
    SearchBar(endpoint="/api/product/search?path=/&perPage=5")
    ul.quivi-navbar-list
      li.quivi-navbar-list-item(class="sm:hidden")
        button(@click="searchActive = !searchActive")
          SrIcon(value="lupa-o" v-if="!searchActive")
          SrIcon(value="x-o" v-else)
          span Busqueda
      li.quivi-navbar-list-item.hidden(class="sm:flex")
        a(href="tel:5555555555") 5555555555
      li.quivi-navbar-list-item
        button(@click="contactModal = true")
          SrIcon(value="contacto-o")
          span Contacto
      li.quivi-navbar-list-item
        button.cart-btn(@click="cartSwitch = true")
          ClientOnly
            span.cart-counter(v-if="productsLength") {{ productsLength }}
          SrIcon(value="carrito-o")
          span Carrito
      li.quivi-navbar-list-item
        button.variant-red(@click="loginSw = true")
            .icon-container
              SrIcon(value="registrarsecaja-o")
            span Ingresar
  ul.quivi-navbar-menu(:class="{active: menuActive}")
    li.quivi-navbar-item(v-for="(item, i) in navigation" :class="{active: item.active}" :key="i")
      .link-container  
        NuxtLink(:to="item.url")
          span {{ item.name }}
          SrIcon(value="ir-o" v-if="!item.items || (item.items && !item.items.length)")
        button.collapse(@click="item.active = !Boolean(item.active)" v-if="item.items && item.items.length")
          SrIcon(value="desplazamientoabajo-o")
      
        svg.bg
          defs
            linearGradient(id="stateMenuBtnHover" x1="0%" y1="0%" x2="0%" y2="100%")
              stop(offset="0%" stop-color="#000000")
              stop(offset="100%" stop-color="#000000")
            linearGradient(id="stateMenuBtn" x1="0%" y1="0%" x2="0%" y2="100%")
              stop(offset="0%" :stop-color="btnColor1")
              stop(offset="100%" :stop-color="btnColor2")
          use(href="/icon/botonmenu-o.svg#s")
      ol.quivi-navbar-submenu(v-if="item.items && item.items.length" role="list")
        li.quivi-navbar-submenu-item(v-for="(el, e) in item.items" :key="e")
          NuxtLink(:to="el.url") {{ el.name }}
</template>

<script lang="ts" setup>
import { colorQuiviDarkestGray, colorQuiviGray } from "~/assets/ts/tokens";

const { data: navigation } = await useFetch("/api/content/navigation");

const searchActive = ref(false);
const menuActive = ref(false);

const contactModal = useState("contactModal", () => false);
const cartSwitch = useState("cartSwitch", () => false);
const loginSw = useState("loginSw", () => false);

const btnColor1: string = colorQuiviGray;
const btnColor2: string = colorQuiviDarkestGray;

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
});

const productsLength = computed(() => {
  let total = 0;
  cart.value.products.forEach((product: any) => {
    total += Number(product.qty);
  });

  return total;
});
</script>

<style lang="scss" scoped>
.quivi-navbar {
  padding-top: unit(10);
  padding-bottom: unit(10);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 unit(4) unit(20) rgba($color-quivi-dark-gray, 0.3);
  transition: padding-top 0.35s ease;

  &.active-search {
    @media (max-width: $breakpoint-sm) {
      padding-top: unit(60);

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
        margin-right: unit(20);
      }
    }
  }

  &-burguer {
    background: none;
    border: none;
    padding: 0;
    width: unit(30);
    height: unit(30);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;

    .sr-icon {
      width: unit(30);
      height: unit(30);
      color: $color-quivi-gray;
    }

    @media (min-width: $breakpoint-sm) {
      display: none;
    }
  }

  .logo {
    width: 20%;
    min-width: unit(100);

    @media (min-width: $breakpoint-sm) {
      min-width: unit(180);
      margin: 0 !important;
      padding-right: unit(20);
    }
  }

  .quivi-searchbar {
    display: flex;
    position: fixed;
    flex-shrink: 1;
    top: -100%;
    left: 50%;
    z-index: 2;
    width: calc(100% - unit(40));
    transform: translateX(-50%);
    transition: top 0.35s ease;

    @media (min-width: $breakpoint-sm) {
      position: relative;
      min-width: unit(300);
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
    border-bottom-left-radius: unit(8);
    border-bottom-right-radius: unit(8);
    background: linear-gradient(
      to right,
      $color-quivi-gray,
      $color-quivi-darkest-gray
    );
    box-shadow: 0 unit(10) unit(10) rgba($color-black, 0.3);
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
      margin-bottom: unit(-50);
      padding-left: unit(20);
      padding-right: unit(20);
    }
  }

  &-list {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &-item {
      width: unit(30);
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
        border-radius: unit(8);
        overflow: hidden;

        span {
          display: none;
          color: $color-text-color;
          font-size: unit(12);
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
            padding: unit(4);
            color: $color-text-color;
          }
        }

        .sr-icon {
          width: unit(30);
          height: unit(40);
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
          width: unit(20);
          height: unit(20);
          background-color: $color-quivi-red;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: unit(12);
          color: $color-white;
        }
      }

      &.hidden {
        display: none !important;
      }

      &:not(:last-child) {
        margin-right: unit(20);
      }

      @media (min-width: $breakpoint-sm) {
        width: unit(80);
        button {
          span {
            display: inline-block;
            font-size: unit(16);
          }

          .sr-icon {
            width: unit(40);
            height: unit(50);
          }
        }
        &.sm\:hidden {
          display: none;
        }
        &.sm\:flex {
          display: flex !important;
        }

        &:not(:last-child) {
          margin-right: unit(10);
        }
      }
    }
  }

  &-item {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;

    &:not(:last-child) {
      &::after {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        content: "";
        width: 95%;
        height: unit(2);
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
      padding: unit(16);

      .sr-icon {
        width: unit(25);
        height: unit(25);
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
      padding: unit(16);

      .sr-icon {
        width: unit(25);
        height: unit(25);
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
        margin-right: unit(20);
      }

      &:hover {
        z-index: 3;
        .bg {
          fill: url(#stateMenuBtnHover);
        }

        .quivi-navbar-submenu {
          max-height: 100vh;
          padding-top: unit(28);
        }
      }

      a {
        padding: unit(10);
        text-align: center;
        height: unit(55);
        color: $color-white;
        min-width: unit(130);
        position: relative;
        z-index: 2;
        font-family: Bebas;
        font-size: unit(26);
        line-height: 1.4;
        justify-content: center;

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
      top: unit(14);
      min-width: unit(250);
      box-shadow: 0 unit(10) unit(10) rgba($color-black, 0.3);
      background: linear-gradient(
        to right,
        $color-quivi-gray,
        $color-quivi-darkest-gray
      );
      border-bottom-left-radius: unit(18);
      border-bottom-right-radius: unit(18);
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
        font-size: unit(18);
        height: auto;
        line-height: 1.8;
        text-transform: capitalize;
        text-align: left;
        padding-right: unit(20);
        padding-left: unit(20);
      }

      &:not(:last-child) {
        &::after {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          content: "";
          width: 95%;
          height: unit(2);
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
          padding-left: unit(16);
          padding-right: unit(16);
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>
