<script lang="ts" setup>
defineProps({
  select: {
    type: Object,
    default: () => ({
      label: "",
      value: "",
    }),
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<template lang="pug">
.quivi-product-edit-list
  SrText(:text="`Edit ${select.label}`" class="title text-center")
  ul.quivi-product-edit-list-items
    li(v-for="(item, i) in items" :key="i")
      p {{ item.label }}
</template>
