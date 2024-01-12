<template lang="pug">
.quivi-loader
    SrContainer
        SrText(text="Cargando..." kind="title" alignment="center")
</template>

<script setup></script>

<style lang="scss" scoped>
.quivi-loader {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 9999;
  background-color: white;
  top: 0;
  left: 0;
}
</style>
