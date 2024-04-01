<template lang="pug">
SrContainer.panel(:with-padding="true")
  ul
    li(v-for="(item, i) in items" :key="i")
      NuxtLink(:to="item.to") {{ item.label }}
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const items = [
  {
    label: "Users",
    to: "/panel/users",
  },
  {
    label: "Ventas",
    to: "/panel/sales",
  },
  {
    label: "Envios",
    to: "/panel/shipping",
  },
  {
    label: "Contenido",
    to: "/panel/content",
  },
];
</script>

<style lang="scss" scoped>
.panel {
}
</style>
