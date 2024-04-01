<script lang="ts" setup>
defineProps({
  status: {
    type: Number,
    default: 0,
  },
});
</script>

<template lang="pug">
.status
  slot
  span.status-indicator(:class="{ active: status == 2, pending: status == 1}")
</template>

<style lang="scss">
.status {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: pxToRem(10);

  &-indicator {
    width: pxToRem(10);
    height: pxToRem(10);
    border-radius: pxToRem(5);
    background-color: $color-quivi-gray;
    &.pending {
      background-color: $color-system-warning;
    }
    &.active {
      background-color: $color-quivi-green;
    }
  }
}
</style>
