<template lang="pug">
.main
  ContentRenderer(v-if="page?.body" :value="page")
</template>

<script lang="ts" setup>
const { page } = await usePageContent("/");
</script>
