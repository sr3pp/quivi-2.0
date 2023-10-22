<template lang="pug">
.quivi-cart(:class="{ active, 'active-done': activeDone }")
    .quivi-cart-content
        button.quivi-cart-close(:class="{ active }" @click="closeCart") X
        SrText(value="Carrito" kind="title")  
    .quivi-cart-backdrop(@click="closeCart")
</template>

<script lang="ts" setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);
const activeDone = ref(false);
const closeCart = () => {
  activeDone.value = false;
  setTimeout(() => {
    emit("close");
  }, 350);
};
watch(
  () => props.active,
  (value) => {
    if (value) {
      setTimeout(() => {
        activeDone.value = true;
      }, 100);
    }
  },
);
</script>

<style lang="scss" scoped>
.quivi-cart {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
  display: flex;
  justify-content: flex-end;

  &-content {
    background-color: $color-white;
    width: 30vw;
    min-width: unit(300);
    padding: unit(20);
    transform: translateX(100%);
    position: relative;
    transition: transform 0.3s ease-in-out;
    z-index: 2;
  }
  &.active {
    z-index: 3;

    &-done {
      .quivi-cart {
        &-backdrop {
          opacity: 1;
          z-index: 1;
        }

        &-content {
          transform: translateX(0);
        }
        &-close {
          transform: translateX(-50%);
        }
      }
    }
  }

  &-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color-black, 0.6);
    opacity: 0;
    z-index: 0;
    backdrop-filter: blur(unit(4));
    transition: opacity 0.3s ease-in-out;
  }
  .quivi-cart-close {
    position: absolute;
    top: unit(20);
    left: 0;
    background-color: $color-quivi-red;
    color: $color-white;
    font-family: Bebas;
    border: none;
    font-size: unit(20);
    cursor: pointer;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: unit(30);
    height: unit(30);
    transform: translateX(0);
    transition: transform 0.35s ease;
  }
}
</style>
