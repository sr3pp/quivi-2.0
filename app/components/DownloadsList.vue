<template lang="pug">
.downloads-list
    p Descargas
    ul.downloads-list-element
        li.downloads-list-element-list(v-for="([key, value], i) in Object.entries(downloads)" :key="i")
            p {{key}}
            ol.downloads-list-submenu
                li.downloads-list-submenu-item(v-for="(item, i) in value" :key="i")
                    a(:href="`/downloads${path}/${key}/${item}`" target="_blank") {{ item }}
</template>

<script lang="ts" setup>
defineProps({
  downloads: {
    type: Object,
    default: () => ({}),
  },
  path: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.downloads-list {
  &-element {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    &-list {
      display: flex;
      flex-direction: column;

      max-width: 25%;
      width: 100%;
      flex-shrink: 0;
      padding: pxToRem(20);

      > .sr-text {
        margin-bottom: pxToRem(10);
      }

      &:not(:last-child) {
        border-right: {
          width: pxToRem(2);
          color: $color-quivi-light-red;
          style: solid;
        }
      }
    }
  }
  &-submenu {
    &-item {
      a {
        word-break: break-all;
      }
    }
  }
}
</style>
