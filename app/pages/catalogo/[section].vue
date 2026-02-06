<script lang="ts" setup>
const { path } = useRoute();

const [{ page }, downloads] = await Promise.all([
  usePageContent(path),
  $fetch(`/api/content/downloads?path=${path}`),
]);
</script>

<template lang="pug">
.catalogo-detail
    ContentRenderer(v-if="page?.body" :value="page")
    UContainer(:with-padding="true")
        DownloadsList(:downloads="downloads" :path="path")
</template>
