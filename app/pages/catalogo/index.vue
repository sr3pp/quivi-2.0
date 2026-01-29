<template lang="pug">
  ContentRenderer(v-if="page?.body" :value="page")
</template>

<script lang="ts" setup>
const route = useRoute();
const { page } = await usePageContent(route.path);
</script>

<style lang="scss" scoped>
.catalogo {
  &-item {
    align-items: center;

    a {
      display: flex;
      color: $color-text-color;
    }

    &-description {
      padding: pxToRem(10);

      &-list {
        &-item {
          color: $color-quivi-gray;
          display: flex;
          align-items: center;

          .sr-icon {
            width: pxToRem(25);
            height: pxToRem(25);
          }
        }
      }
    }
  }

  &-banner {
    width: 40% !important;
    border-radius: pxToRem(20);
    margin-right: pxToRem(10);
    overflow: hidden;
  }

  &-brands {
    margin-bottom: pxToRem(20);

    [class*="sr-grid-col"] {
      display: flex;
      justify-content: center;
      padding: pxToRem(20);

      &:first-child {
        padding: 0;
      }

      .sr-text {
        &.subtitle {
          font-family: inria !important;
        }
      }
    }
  }

  .and-more {
    color: $color-quivi-green;
    font-size: pxToRem(20);
  }
}
</style>
