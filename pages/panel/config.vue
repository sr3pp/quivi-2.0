<template lang="pug">
.config
  SrContainer(:with_space="true")
    SrText(value="Panel Config" kind="title" alignment="center")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});
</script>

<style lang="scss" scoped>
.config {
}
</style>
