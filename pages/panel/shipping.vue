<template lang="pug">
.panel
  SrContainer(:with_space="true")
    SrText(value="Panel Envios" kind="title" alignment="center")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});
</script>

<style lang="scss" scoped>
.panel {
}
</style>
