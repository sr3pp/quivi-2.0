<template lang="pug">
  ContentRenderer(v-if="page?.body" :value="page")
</template>

<script lang="ts" setup>
const route = useRoute();
const { data: page } = await useAsyncData("catalogo-page", () => queryCollection("pages").path(route.path).first());
</script>
