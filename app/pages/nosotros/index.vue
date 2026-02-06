<template lang="pug">
.quivi-nosotros
  ContentRenderer(v-if="page?.body" :value="page")
  p(v-else) Cargando contenido...
</template>

<script lang="ts" setup>
const route = useRoute();
const { page } = await usePageContent(route.path);
</script>
