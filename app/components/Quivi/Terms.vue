<template lang="pug">
.quivi-terms
  SrText(:text="terms.title" class="title" alignment="center")
  SrText.quivi-terms-date(:text="terms.fecha" alignment="center")
  ul.quivi-terms-list  
    li.quivi-terms-list-item(v-for="(term, i) in terms.sections" :key="i")
      SrText(:text="term.title" class="subtitle")
      SrText(:text="term.content")
</template>

<script lang="ts" setup>
defineProps({
  terms: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="scss" scoped>
.quivi-terms {
  &-date {
    margin-bottom: pxToRem(20);
  }
  &-list {
    &-item {
      .sr-text {
        &.subtitle {
          margin-bottom: pxToRem(8);
        }
      }
      &:not(:last-child) {
        margin-bottom: pxToRem(26);
      }
    }
  }
}
</style>
