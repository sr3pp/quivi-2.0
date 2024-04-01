<template lang="pug">
aside.sidebar 
    nav.sidebar-nav
        ul.sidebar-menu
            li.sidebar-menu-item(v-for="(item, i) in items" :key="i")
                NuxtLink(:to="item.url")
                    SrIcon(:name="item.icon")
                    span {{ item.label }}
</template>

<script lang="ts" setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  height: 100vh;
  width: pxToRem(50);
  display: flex;
  align-items: center;
  background-color: $color-quivi-darkest-red;
  color: $color-white;

  &-nav {
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translateY(-50%);
  }

  &-menu {
    display: flex;
    flex-direction: column;

    &-item {
      height: pxToRem(50);
      display: flex;
      align-items: center;
      a {
        display: flex;
        align-items: center;
        color: currentColor;
      }

      span {
        position: relative;
        margin-left: pxToRem(10);
        color: $color-white;
        background-color: $color-quivi-light-red;
        border-radius: pxToRem(5);
        max-width: 0;
        overflow: hidden;
        transition:
          max-width 0.3s ease-in-out,
          padding 0.3s ease-in-out;

        &::before {
          opacity: 0;
          content: "";
          position: absolute;
          top: 50%;
          right: 100%;
          transform: translate(50%, -50%) rotate(45deg);
          background-color: $color-quivi-light-red;
          width: pxToRem(10);
          height: pxToRem(10);
          transition: opacity 0.3s ease-in-out;
        }
      }

      .sr-icon {
        flex-shrink: 0;
        width: pxToRem(25);
        height: pxToRem(25);
        margin-right: pxToRem(4);
      }

      &:hover {
        span {
          overflow: visible;
          padding: pxToRem(10);
          max-width: pxToRem(200);
          &:before {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
