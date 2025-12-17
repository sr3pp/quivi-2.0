<template lang="pug">
.quivi-nosotros
  ContentRenderer(v-if="page?.body" :value="page")
  p(v-else) Cargando contenido...
</template>

<script lang="ts" setup>
const route = useRoute();
const { page } = await usePageContent(route.path);
</script>

<style lang="scss">
.quivi-nosotros {
  .about {
    &_2 {
      &.contained {
        max-width: pxToRem(800) !important;
      }
      .sr-text {
        margin: auto;
      }
    }
    &_3 {
      background-color: $color-quivi-light-blue;

      .sr-icon {
        background-color: $color-quivi-light-blue;
        color: $color-quivi-red;
        width: pxToRem(80);
        height: pxToRem(80);
        padding: pxToRem(10);
        margin-top: pxToRem(-80);
        margin-bottom: pxToRem(20);
        margin-left: auto;
        margin-right: auto;
        border-top-left-radius: pxToRem(10);
        border-top-right-radius: pxToRem(10);
      }

      .sr-text {
        &.title {
          .sr-text-container {
            font-family: inria !important;
            font-weight: bold;
            margin-bottom: pxToRem(10);
          }
        }
      }

      .sr-container {
        padding-bottom: pxToRem(20);

        @media (min-width: #{$breakpoint-sm}) {
          padding-bottom: pxToRem(40);
        }
        @media (min-width: #{$breakpoint-md}) {
          padding-bottom: pxToRem(50);
        }
      }
    }
  }
}
</style>
