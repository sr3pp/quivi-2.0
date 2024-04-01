<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    default: () => [],
  },
  alignment: {
    type: String,
    default: "left",
  },
});
</script>

<template lang="pug">
.quivi-list
  SrText(:text="title" :style="{ '--text-align': alignment }" class="subtitle")
  ul.quivi-list-list(:style="{ '--text-align': alignment }")
    li.quivi-list-item(v-for="(item, i) in items" :key="i")
      SrIcon(name="Q-o")
      SrText(:text="item" :style="{ '--text-align': alignment }")
</template>

<style scoped lang="scss">
.quivi-list {
  display: flex;
  flex-direction: column;
  > .sr-text {
    margin-bottom: pxToRem(6);
  }
  &-list {
    gap: pxToRem(6);
    display: flex;
    flex-direction: column;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: var(--text-align);
    .sr-icon {
      width: pxToRem(25);
      height: pxToRem(25);
      margin-right: pxToRem(4);
    }
  }
}
</style>
