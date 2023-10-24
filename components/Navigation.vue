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
          SrIcon(value="carrito-o")
          span Contacto
      li.quivi-navbar-list-item
        button(@click="cartSwitch = true")
          SrIcon(value="carrito-o")
          span Carrito
      li.quivi-navbar-list-item
        button(@click="loginSw = true")
            SrIcon(value="carrito-o")
            span Ingresar
  ul.quivi-navbar-menu
    li.quivi-navbar-item(v-for="(item, i) in navigation" :key="i")
      NuxtLink(:to="item.url") {{ item.name }}
      ol.quivi-navbar-submenu(v-if="item.items" role="list")
        li.quivi-navbar-submenu-item(v-for="(el, e) in item.items" :key="e")
          NuxtLink(:to="el.url") {{ el.name }}
</template>

<script lang="ts" setup>
const { data: navigation } = await useFetch("/api/content/navigation");

const contactModal = useState("contactModal", () => false);
const cartSwitch = useState("cartSwitch", () => false);
const loginSw = useState("loginSw", () => false);
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
        width: 100%;
        background: none;
        border: none;
        color: $color-text-color;
        display: flex;
        flex-direction: column;
        align-items: center;

        .sr-icon {
          width: unit(30);
          height: unit(30);
          color: currentColor;
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
    overflow: hidden;

    &:not(:last-child) {
      margin-right: unit(20);
    }

    a {
      padding: unit(10);
      text-align: center;
      height: unit(50);
      background-color: $color-quivi-gray;
      color: $color-white;
      min-width: unit(130);
    }

    &:hover {
      overflow: visible;

      .quivi-navbar-submenu {
        max-height: 100vh;
        opacity: 1;
      }
    }
  }

  &-submenu {
    display: flex;
    position: absolute;
    top: 100%;
    right: 0;
    min-width: unit(150);
    max-height: 0;
    opacity: 0;
    background-color: gray;
    transition:
      max-height 0.35s ease-out,
      opacity 0.35s ease;

    &-item {
      width: 100%;
      display: flex;

      a {
        width: 100%;
      }
    }
  }
}
</style>
