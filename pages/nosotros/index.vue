<template lang="pug">
.nosotros
    component(v-for="(component, i) in content" :is="component.component" :key="i" v-bind="component.props")
</template>

<script lang="ts" setup>
const { data: content } = await useFetch("/api/content?page=nosotros/index");
</script>

<style lang="scss" scoped></style>
