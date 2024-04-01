<template lang="pug">
.panel
  Sidebar(:items="items")
  .content
    NuxtPage
</template>

<script lang="ts" setup>
const items = [
  {
    label: "Users",
    icon: "ingresar-o",
    url: "/panel/users",
  },
  {
    label: "Productos",
    icon: "carrito-o",
    url: "/panel/products",
  },
  {
    label: "Ventas",
    icon: "carrito-o",
    url: "/panel/sales",
  },
  {
    label: "Envios",
    icon: "carrito-o",
    url: "/panel/shipping",
  },
  {
    label: "Contenido",
    icon: "carrito-o",
    url: "/panel/content",
  },
  {
    label: "Configuracion",
    icon: "carrito-o",
    url: "/panel/config",
  },
  {
    label: "Negocio",
    icon: "carrito-o",
    url: "/panel/business",
  },
];
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  height: 100vh;

  .content {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
}
</style>
