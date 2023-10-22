<template lang="pug">
.main
  component(v-for="(component, i) in content" :is="component.component" :key="i" v-bind="component.props")

</template>

<script lang="ts" setup>
const { data: content } = await useFetch("/api/content?page=index");
</script>

<style lang="scss">
.main {
  .sr-container {
    height: 100%;
  }

  .products-section {
    padding-top: unit(40);
    padding-bottom: unit(40);
  }

  .sr-text {
    &.kind {
      &-title {
        margin-bottom: unit(40) !important;
      }
    }
  }

  .logo {
    width: 50vw;
    min-width: unit(300);
    margin: auto;
  }
}
</style>
