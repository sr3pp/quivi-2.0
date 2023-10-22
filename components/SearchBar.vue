<template lang="pug">
.quivi-searchbar
    input(type="text" placeholder="Buscar")
    button
        SrIcon(value="lupa-o")
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.quivi-searchbar {
  display: flex;

  height: unit(50);
  border-radius: unit(8);
  overflow: hidden;

  input {
    width: 100%;
    border: none;
    background-color: $color-white;
    padding: unit(8);
    font-size: unit(16);
  }

  button {
    padding: unit(4);
    background-color: $color-quivi-red;
    color: $color-white;
    border: none;

    .sr-icon {
      flex-shrink: 0;
      width: unit(25);
      height: unit(25);
    }
  }
}
</style>
