<template lang="pug">
.main
  ContentRenderer(v-if="page?.body" :value="page")
</template>

<script lang="ts" setup>
const { page } = await usePageContent("/");

console.log("the fetched page", page);
</script>

<style lang="scss">
.main {
  .sr-container {
    height: 100%;
  }

  .products-section {
    padding-top: pxToRem(40);
    padding-bottom: pxToRem(40);
  }

  .sr-text {
    &.kind {
      &-title {
        margin-bottom: pxToRem(40) !important;
      }
    }
  }

  .logo {
    width: 50vw;
    min-width: pxToRem(300);
    margin: auto;
  }
}
</style>
