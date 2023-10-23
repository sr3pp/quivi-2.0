<template lang="pug">
.catalogo-detail
    component(v-for="(component, i) in content" :is="component.component" :key="i" v-bind="component.props")

    SrContainer(:with_space="true")
        DownloadsList(:downloads="downloads" :path="path")
</template>

<script lang="ts" setup>
const { path } = useRoute();
const { data: content } = await useFetch(`/api/content?page=${path}`);
const { data: downloads } = await useFetch(
  `/api/content/downloads?path=${path}`,
);
</script>
