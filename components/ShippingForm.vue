<template lang="pug">
.shipping-form
    SrForm(:fieldsets="shipmentForm" class="shipping-form-form" submit="hidden")
</template>

<script lang="ts" setup>
import { dataFromForm } from "sr-content-2/assets/ts/utilities";

const props = defineProps({
  shipmentForm: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["save-shipping", "update-shipping"]);

const setShippmentData = (data: any) => {
  emit("save-shipping", data);
};

watch(
  props.shipmentForm,
  (value: any) => {
    const data = dataFromForm(value);
    emit("update-shipping", data.address);
  },
  {
    deep: true,
  },
);
</script>

<style lang="scss">
.shipping-form {
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
