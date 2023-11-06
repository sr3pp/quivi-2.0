import { colorDarkGray } from '~/assets/ts/tokens';
<template lang="pug">
nav.quivi-navbar
  SrContainer
    NuxtLink.logo(to="/")
      SrImg(src="/img/logo.png" alt="Comercializadora Quivi Logo" width="180" height="auto")
    SearchBar(endpoint="/api/product/search?perPage=5")
    ul.quivi-navbar-list
      li.quivi-navbar-list-item
        a(href="tel:5555555555") 5555555555
      li.quivi-navbar-list-item
        button(@click="contactModal = true")
          SrIcon(value="contacto-o")
          span Contacto
      li.quivi-navbar-list-item
        button(@click="cartSwitch = true")
          ClientOnly
            span(v-if="productsLength") {{ productsLength }}
          SrIcon(value="carrito-o")
          span Carrito
      li.quivi-navbar-list-item
        button.variant-red(@click="loginSw = true")
            .icon-container
              SrIcon(value="registrarsecaja-o")
            span Ingresar
  ul.quivi-navbar-menu
    li.quivi-navbar-item(v-for="(item, i) in navigation" :key="i")
      NuxtLink(:to="item.url") {{ item.name }}
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
        li.quivi-navbar-submenu-item(v-for="(el, e) in [...item.items, ...item.items]" :key="e")
          NuxtLink(:to="el.url") {{ el.name }}
</template>

<script lang="ts" setup>
import { colorQuiviDarkestGray, colorQuiviGray } from "~/assets/ts/tokens";

const { data: navigation } = await useFetch("/api/content/navigation");

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
  .sr-container {
    display: flex;
    align-items: center;
    > * {
      &:not(:last-child) {
        margin-right: unit(20);
      }
    }
  }

  .logo {
    width: 20%;
    min-width: unit(180);
    margin: 0 !important;
    padding-right: unit(20);
  }

  .quivi-searchbar {
    min-width: unit(300);
    width: 40%;
  }

  &-menu {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-bottom: unit(-50);
    padding-left: unit(20);
    padding-right: unit(20);
  }

  &-list {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &-item {
      width: unit(80);
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
          color: $color-text-color;
          font-size: unit(16);
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
          width: unit(40);
          height: unit(50);
          color: $color-quivi-light-red;
        }
      }

      &:not(:last-child) {
        margin-right: unit(20);
      }
    }
  }

  &-item {
    display: flex;
    position: relative;
    z-index: 2;

    &:not(:last-child) {
      margin-right: unit(20);
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

      &.router-link-active {
        + svg {
          fill: url(#stateMenuBtnHover);
        }
      }
    }

    .bg {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      fill: url(#stateMenuBtn);
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
  }

  &-submenu {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 0;
    position: absolute;
    top: unit(14);
    left: 0;
    min-width: unit(150);
    padding-top: 0;
    max-height: 0;
    opacity: 1;
    min-width: unit(250);
    box-shadow: 0 unit(10) unit(10) rgba($color-black, 0.3);
    background: linear-gradient(
      to right,
      $color-quivi-gray,
      $color-quivi-darkest-gray
    );
    border-bottom-left-radius: unit(18);
    border-bottom-right-radius: unit(18);
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
        padding-right: unit(16);
        padding-left: unit(16);
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
    }
  }
}
</style>
