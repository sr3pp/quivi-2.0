<template lang="pug">
.quivi-pagination
    ul.quivi-pagination-list
        li.quivi-pagination-item(v-if="displayBefore")
            NuxtLink(:to="`?page=${pagination.page-1}`")  Anterior
        li.quivi-pagination-item(v-for="page in range(pagination.startIndex, pagination.endIndex)" :class="{current: page + 1 == pagination.page}" :key="page")
            NuxtLink(:to="`?page=${page + 1}`" :disabled="page + 1 == pagination.page") {{ page + 1}}
        li.quivi-pagination-item(v-if="displayAfter")
            NuxtLink(:to="`?page=${Number(pagination.page)+1}`") Siguiente
    span.quivi-pagination-detail {{ pagination.pages }} páginas
</template>

<script lang="ts" setup>
const props = defineProps({
  pagination: {
    type: Object,
    default: () => ({
      startIndex: 0,
      endIndex: 0,
      limit: 0,
      pages: 0,
      page: 1,
    }),
  },
});

const displayBefore = computed(() => props.pagination.page > 1);
const displayAfter = computed(
  () => props.pagination.page < props.pagination.pages,
);

const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
</script>

<style lang="scss">
.quivi-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  &-list {
    display: flex;
    a {
      padding: unit(8);
    }
  }

  &-item {
    display: flex;

    &.current {
      background-color: $color-quivi-red;
      color: $color-white;
      border-radius: unit(8);
      a {
        color: currentColor;
      }
    }
  }

  &-detail {
    font-size: unit(14);
    color: $color-quivi-light-gray;
  }
}
</style>
