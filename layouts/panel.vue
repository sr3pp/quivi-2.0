<template lang="pug">
.panel
  Sidebar(:items="items")
  .content
    NuxtPage

  ClientOnly
    NotificationStack
</template>

<script lang="ts" setup>
const notifications = useState("notifications", (): any => []);
const items = [
  {
    label: "Users",
    icon: "ingresar-o",
    url: "/panel/users",
  },
  {
    label: "Productos",
    icon: "product-f",
    url: "/panel/products",
  },
  {
    label: "Ventas",
    icon: "sales-f",
    url: "/panel/sales",
  },
  {
    label: "Envios",
    icon: "send-order-f",
    url: "/panel/shipping",
  },
  {
    label: "Contenido",
    icon: "edit-o",
    url: "/panel/content",
  },
  {
    label: "Configuracion",
    icon: "settings-f",
    url: "/panel/config",
  },
  {
    label: "Negocio",
    icon: "business-f",
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
