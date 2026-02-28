<script lang="ts" setup>
const { path } = useRoute();

const { data: page } = await useAsyncData(`catalogo-${path}`, async () => queryCollection('pages').path(path).first());

</script>

<template lang="pug">
.catalogo-detail
    ContentRenderer(v-if="page?.body" :value="page")
    UContainer.py-10
        DownloadsList(:path="path.replace('/catalogo/', '')")
</template>
