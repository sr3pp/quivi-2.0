<template lang="pug">
.quivi-cart(:class="{ active: isOpen, 'active-done': activeDone }")
    .quivi-cart-content
      .quivi-cart-header
        button.quivi-cart-close(:class="{ active: isOpen }" @click="toggleCart") X 
        button.quivi-cart-empty(@click="emptyCart" v-if="cart.products.length") Vaciar carrito
      template(v-if="cart.products.length")
        CartList(:products="cart.products" :editable="true" @remove="removeFromCart")
        CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
      template(v-else)
        SrText.quivi-cart-empty(text="Tu carrito está vacío" class="title text-center")
    .quivi-cart-backdrop(@click="toggleCart")
</template>

<script lang="ts" setup>
import { lockBody } from "sr-content-2/assets/ts/utilities";

const {
  active,
  toggleCart,
  removeFromCart,
  emptyCart,
  totalCartProducts,
  cart,
} = useCart();
const emit = defineEmits(["close"]);
const isOpen = ref(active.value);
const activeDone = ref(false);

watch(active, (value) => {
  if (value) {
    lockBody(true);
    isOpen.value = true;
    setTimeout(() => {
      activeDone.value = true;
    }, 100);
  } else {
    lockBody(false);
    activeDone.value = false;
    setTimeout(() => {
      isOpen.value = false;
    }, 350);
  }
});
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

  &-empty {
    margin: auto;
  }

  &-content {
    display: flex;
    flex-direction: column;
    background-color: $color-white;
    width: 30vw;
    min-width: pxToRem(300);
    transform: translateX(100%);
    position: relative;
    transition: transform 0.3s ease-in-out;
    z-index: 2;
  }
  &.active {
    z-index: 2147483001;

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

  &-pay-button {
    margin-top: auto;
    margin-bottom: 0;
  }

  &-total {
    margin-top: auto;
    margin-bottom: 0;
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
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
    backdrop-filter: blur(pxToRem(4));
    transition: opacity 0.3s ease-in-out;
  }

  &-close {
    position: absolute;
    top: pxToRem(20);
    left: 0;
    background-color: $color-quivi-red;
    color: $color-white;
    font-family: Bebas;
    border: none;
    font-size: pxToRem(20);
    cursor: pointer;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: pxToRem(30);
    height: pxToRem(30);
    transform: translateX(0);
    transition: transform 0.35s ease;
  }

  &-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: pxToRem(20);
    border-bottom: {
      style: solid;
      color: $color-quivi-gray;
      width: pxToRem(1);
    }

    .quivi-cart-empty {
      font-family: Inria;
      background: none;
      font-size: pxToRem(16);
      font-weight: bold;
      color: $color-quivi-green;
      border: none;
    }
  }
}
</style>
