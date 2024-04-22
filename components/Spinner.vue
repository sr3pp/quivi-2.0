<script lang="ts" setup></script>

<template lang="pug">
.spinner
</template>

<style lang="scss" scoped>
.spinner {
  width: pxToRem(48);
  height: pxToRem(48);
  background: $color-white;
  border-radius: 50%;
  position: relative;
  animation: skLinRotate 1s ease-in-out infinite alternate;
  &::after {
    content: "";
    position: absolute;
    inset: pxToRem(5);
    border-radius: 50%;
    border: pxToRem(5) solid transparent;
    border-top-color: $color-quivi-light-red;
  }
}
@keyframes skLinRotate {
  95%,
  100% {
    transform: rotate(840deg);
  }
}
</style>
