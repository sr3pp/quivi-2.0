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
  border-radius: unit(99);
  width: unit(50);
  height: unit(50);
  display: flex;
  align-items: center;
  justify-content: center;

  &-label {
    font-family: Bebas;
    font-size: unit(30);
    color: $color-white;
  }

  &-content {
    position: absolute;
    bottom: 100%;
    opacity: 0;
    min-width: unit(200);
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
    padding: unit(8) unit(8);
    border-radius: unit(8);
    background-color: $color-quivi-gray;
    color: $color-white;
    display: flex;
    justify-content: center;
    font-size: unit(14);
    transition:
      bottom 0.35s ease,
      max-width 0.35s ease,
      z-index 0.35s ease,
      opacity 0.35s ease;

    &::after {
      content: "";
      width: unit(10);
      height: unit(10);
      background-color: $color-quivi-gray;
      position: absolute;
      bottom: unit(-5);
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  }

  &:hover {
    .quivi-tooltip-content {
      opacity: 1;
      z-index: 1;
      bottom: calc(100% + unit(16));
    }
  }
}
</style>
