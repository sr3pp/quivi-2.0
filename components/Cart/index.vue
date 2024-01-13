<template lang="pug">
.quivi-cart(:class="{ active, 'active-done': activeDone }")
    .quivi-cart-content
      .quivi-cart-header
        button.quivi-cart-close(:class="{ active }" @click="closeCart") X
        SrText(value="Carrito" kind="title")  
        button.quivi-cart-empty(@click="emptyCart()") Vaciar carrito
      CartList(:products="cart.products" :editable="true" @remove="removeProduct" @setTotal="setTotal")
      CartTotal(:total="cart.total")
      NuxtLink(to="/tienda/checkout") Checkout
    .quivi-cart-backdrop(@click="closeCart")
</template>

<script lang="ts" setup>
import { lockBody } from "sr-content-2/assets/ts/utilities";
import { toPrice, processDiscount } from "~/assets/ts/utilities";
import type { Product } from "~/types";

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
});

const emit = defineEmits(["close"]);
const activeDone = ref(false);
const closeCart = () => {
  activeDone.value = false;
  setTimeout(() => {
    emit("close");
    lockBody(false);
  }, 350);
};

const realPrice = (product: Product): number => {
  if (product.discount) {
    const price = processDiscount(product);

    return Number(price.replace(/[^0-9.-]+/g, ""));
  }
  return Number(product.price);
};

const setTotal = () => {
  let total = 0;
  cart.value.products.forEach((product: Product) => {
    total += realPrice(product) * Number(product.qty);
  });
  cart.value.total = total;
};

const removeProduct = (idx: number) => {
  cart.value.products.splice(idx, 1);
  setTotal();
};

const emptyCart = () => {
  cart.value.products = [];
  setTotal();
};

watch(
  () => props.active,
  (value) => {
    if (value) {
      lockBody(true);
      setTimeout(() => {
        activeDone.value = true;
      }, 100);
    }
  },
);

watch(
  () => cart.value.products,
  (value) => {
    setTotal();
  },
);

setTotal();
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
    display: flex;
    flex-direction: column;
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
  &-close {
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

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: unit(20);

    .quivi-cart-empty {
      background: none;
      color: $color-quivi-light-red;
      border: none;
    }
  }
}
</style>
