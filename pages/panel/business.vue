<template lang="pug">
.business
  SrContainer(:with_space="true")
    SrText(value="Panel Bussines" class="title" alignment="center")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});
</script>

<style lang="scss" scoped>
.business {
}
</style>
