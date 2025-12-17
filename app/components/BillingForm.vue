<template lang="pug">
.billing-form
  SrForm(:fieldsets="billingForm" class="billing-form-form" submit="hidden")
</template>

<script lang="ts" setup>
defineProps({
  billingForm: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss">
.billing-form {
  &-form {
    fieldset {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .sr-form-input,
    .sr-form-select {
      width: calc((100% / 3) - pxToRem(8));
      flex-grow: 1;

      &:last-child {
        flex-grow: 0;
      }
    }
  }
}
</style>
