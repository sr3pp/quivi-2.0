<template lang="pug">
ul.quivi-checkout-steps
  li.quivi-checkout-steps-item(v-for="(step, i) in  steps" :key="i" :class="{active: step.active, done: step.done}")
    button.quivi-checkout-steps-item-label(@click="setStep(i)" :disabled="!step.enabled")
      SrText(:text="step.label" class="subtitle")
      span.quivi-checkout-steps-item-status
</template>

<script lang="ts" setup>
const props = defineProps({
  steps: {
    type: Array,
    default: () => [
      {
        label: "Envío y facturacíon",
        enabled: true,
        done: false,
      },
      {
        label: "Información de pago",
        enabled: false,
        done: false,
      },
      {
        label: "Revisar Orden",
        enabled: false,
        done: false,
      },
    ],
  },
});

const emit = defineEmits(["set-step"]);

const setStep = (idx: number) => {
  const currentIdx = props.steps.findIndex((step: any) => step.active);
  if (currentIdx < idx) return;
  emit("set-step", idx);
};
</script>

<style lang="scss">
.quivi-checkout-steps {
  display: flex;
  padding: pxToRem(20);
  margin-bottom: pxToRem(20) !important;
  &-item {
    display: flex;
    align-items: center;
    flex-grow: 1;
    opacity: 0.5;
    &:not(:last-child) {
      margin-right: pxToRem(20);
    }
    &-label {
      appearance: none;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      background: none;
      border: none;
      &:hover {
        text-decoration: underline;
      }
    }
    &-status {
      width: 100%;
      height: pxToRem(4);
      background-color: $color-quivi-gray;
    }
    &.done {
      .quivi-checkout-steps-item-status {
        background-color: $color-quivi-green;
      }
    }
    &.active {
      opacity: 1;
    }
  }
}
</style>
