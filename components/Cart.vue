<template lang="pug">
.quivi-cart(:class="{ active, 'active-done': activeDone }")
    .quivi-cart-content
      .quivi-cart-header
        button.quivi-cart-close(:class="{ active }" @click="closeCart") X
        SrText(text="Carrito" class="title")  
        button.quivi-cart-empty(@click="emptyCart()") Vaciar carrito
      ul.quivi-cart-products 
        li.quivi-cart-product(v-for="(product, i) in cart.products" :key="i")
          SrPicture(:src="`/products/${product.brand._id}/${product.thumbs[0]}`" :alt="product.name")
          .quivi-cart-product-info
            SrText(:text="product.name" class="subtitle")
            SrText(:text="product.brand.name")
            SrText(:text="product.web")
            SrFormInput(:value="product.qty" type="number" @change="setTotal" @input="product.qty = $event.target.value" :min="1" :max="100")
            .price-container
              SrText.discount(:text="toPrice(product.price)")
              SrText.price(:text="processDiscount(product)" class="subtitle" v-if="product.discount")
          button(@click="removeProduct(product)")
            SrIcon(name="trash-o")
      .quivi-cart-total
        SrText(text="Total:" class="title")
        SrText(:text="toPrice(cart.total)" class="title")
    .quivi-cart-backdrop(@click="closeCart")
</template>

<script lang="ts" setup>
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
    min-width: pxToRem(300);
    padding: pxToRem(20);
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

  &-product {
    display: flex;
    align-items: center;
    padding-top: pxToRem(10);
    padding-bottom: pxToRem(10);
    > button {
      width: pxToRem(40);
      height: pxToRem(40);
      background: none;
      border: none;
      padding: 0;
      margin-bottom: auto;

      .sr-icon {
        width: 100%;
        height: 100%;
      }
    }

    .sr-input {
      width: 100%;
    }
    .sr-img {
      width: pxToRem(100);
      height: pxToRem(100);
      flex-shrink: 0;
      margin-right: pxToRem(20);
    }

    &-info {
      width: 100%;

      .price-container {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .discount {
          color: $color-quivi-red;
          text-decoration: line-through;
        }
        .price {
          margin-left: auto;
        }
      }
    }
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: pxToRem(20);

    .quivi-cart-empty {
      background: none;
      color: $color-quivi-light-red;
      border: none;
    }
  }

  &-total {
    margin-top: auto;
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
