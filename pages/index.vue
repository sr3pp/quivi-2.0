<template lang="pug">
.main
    SrContainer(:with_space="true")
        SrText(value="Sitio en construccion" kind="title" alignment="center")
        SrImg(class="logo" src="/img/logo.png" alt="Logo")
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-items: center;

  background: linear-gradient(180deg, $color-white 60%, $color-quivi-red 100%);

  .sr-container {
    height: 100%;
  }

  .sr-text {
    &.kind {
      &-title {
        font-size: unit(40);
        margin-bottom: unit(40);
      }
    }
  }

  .logo {
    width: 50vw;
    min-width: unit(300);
    margin: auto;
  }
}
</style>
