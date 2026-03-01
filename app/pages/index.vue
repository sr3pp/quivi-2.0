<template lang="pug">
.main
  ContentRenderer(v-if="page?.body" :value="page")
</template>

<script lang="ts" setup>
const { data: page } = await useAsyncData("home-page", () => queryCollection("pages").path("/").first());

useHead({
  title: "Nuxt"
})
</script>
