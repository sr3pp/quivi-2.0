<template lang="pug">
.quivi-tooltip
    span.quivi-tooltip-label ?
    .quivi-tooltip-content
        slot
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.quivi-tooltip {
  position: relative;
  background-color: $color-quivi-red;
  border-radius: pxToRem(99);
  width: pxToRem(50);
  height: pxToRem(50);
  display: flex;
  align-items: center;
  justify-content: center;

  &-label {
    font-family: Bebas;
    font-size: pxToRem(30);
    color: $color-white;
  }

  &-content {
    position: absolute;
    bottom: 100%;
    opacity: 0;
    min-width: pxToRem(200);
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
    padding: pxToRem(8) pxToRem(8);
    border-radius: pxToRem(8);
    background-color: $color-quivi-gray;
    color: $color-white;
    display: flex;
    justify-content: center;
    font-size: pxToRem(14);
    transition:
      bottom 0.35s ease,
      max-width 0.35s ease,
      z-index 0.35s ease,
      opacity 0.35s ease;

    &::after {
      content: "";
      width: pxToRem(10);
      height: pxToRem(10);
      background-color: $color-quivi-gray;
      position: absolute;
      bottom: pxToRem(-5);
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  }

  &:hover {
    .quivi-tooltip-content {
      opacity: 1;
      z-index: 1;
      bottom: calc(100% + pxToRem(16));
    }
  }
}
</style>
