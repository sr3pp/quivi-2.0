<template lang="pug">
.quivi-cart(:class="{ active, 'active-done': activeDone }")
    .quivi-cart-content
      .quivi-cart-header
        button.quivi-cart-close(:class="{ active }" @click="closeCart") X
        SrText(value="Carrito" kind="title")  
        button.quivi-cart-empty(@click="emptyCart()") Vaciar carrito
      ul.quivi-cart-products 
        li.quivi-cart-product(v-for="(product, i) in cart.products" :key="i")
          SrImg(:src="`/products/${product.brand._id}/${product.thumbs[0]}`" :alt="product.name")
          .quivi-cart-product-info
            SrText(:value="product.name" kind="subtitle")
            SrText(:value="product.brand.name")
            SrText(:value="product.web")
            SrFormInput(:value="product.qty" type="number" @change="setTotal" @input="product.qty = $event.target.value" :min="1" :max="100")
            SrText(:value="toPrice(product.price)" kind="price")
          button(@click="removeProduct(product)")
            SrIcon(value="trash-o")

      SrText(:value="`Total: ${toPrice(cart.total)}`" kind="title")
    .quivi-cart-backdrop(@click="closeCart")
</template>

<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";

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

const setTotal = () => {
  let total = 0;
  cart.value.products.forEach((product: any) => {
    total += product.price * product.qty;
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

  &-product {
    display: flex;
    align-items: center;
    padding-top: unit(10);
    padding-bottom: unit(10);
    > button {
      width: unit(40);
      height: unit(40);
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
      width: unit(100);
      height: unit(100);
      flex-shrink: 0;
      margin-right: unit(20);
    }

    &-info {
      width: 100%;
    }
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
