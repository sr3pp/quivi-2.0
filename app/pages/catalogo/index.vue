<template lang="pug">
  ContentRenderer(v-if="page?.body" :value="page")
</template>

<script lang="ts" setup>
const route = useRoute();
const { page } = await usePageContent(route.path);
</script>
