<template lang="pug">
aside.sidebar 
    nav.sidebar-nav
        ul.sidebar-menu
            li.sidebar-menu-item(v-for="(item, i) in items" :key="i")
                NuxtLink(:to="item.url")
                    SrIcon(:value="item.icon")
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
  width: unit(50);
  display: flex;
  align-items: center;

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
      a {
        display: flex;
        align-items: center;
      }

      span {
        max-width: 0;
        overflow: hidden;
        transition: max-width 0.3s ease-in-out;
      }

      .sr-icon {
        flex-shrink: 0;
        width: unit(25);
        height: unit(25);
        margin-right: unit(4);
      }

      &:hover {
        span {
          max-width: unit(200);
        }
      }
    }
  }
}
</style>
