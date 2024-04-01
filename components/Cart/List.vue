<template lang="pug">
ul.quivi-cart-list 
    li.quivi-cart-list-product(v-for="(product, i) in products" :key="i")
        SrPicture(:src="`/products/${product.brand._id}/${product.thumbs[0]}`" :alt="product.name")
        .quivi-cart-list-product-info
            SrText(:text="product.name" class="subtitle")
            SrText(:text="`Marca: ${product.brand.name}`")
            SrText(:text="`Web: ${product.web}`")
            div.quivi-cart-list-qty(v-if="editable")
              button(@click="updateQty(product, -1)") -
              input.sr-form-input(:value="product.qty" @input="validateInput(product, $event)")
              button(@click="updateQty(product, 1)") +
            SrText(v-else :text="`Qty: ${String(product.qty)}`")
            .price-container
                SrText.discount(:text="toPrice(product.price)")
                SrText.price(:text="processDiscount(product)" class="subtitle" v-if="product.discount")
        button(@click="removeProduct(product)" v-if="editable")
            SrIcon(name="trash-o")
</template>

<script lang="ts" setup>
import { h } from "vue";
import { toPrice, processDiscount } from "~/assets/ts/utilities";
import type { Product } from "~/types";

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  editable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["remove", "setTotal"]);
const removeProduct = (product: Product) => {
  emit("remove", product);
};

const validateInput = (product: Product, $event: InputEvent) => {
  const targetValue = ($event.target as HTMLInputElement).value;
  const value = targetValue.replace(/[^0-9]/g, "");
  ($event.target as HTMLInputElement).value = value;
  setTotal(product, Number(value));
};

const updateQty = (product: Product, value: number) => {
  const qty = (product.qty as number) + value;
  setTotal(product, qty);
};

const setTotal = (product: Product, value: number) => {
  const qty = value < 1 ? 1 : value;
  product.qty = qty;
  emit("setTotal");
};
</script>

<style lang="scss">
.quivi-cart-list {
  padding: pxToRem(20) !important;
  height: 100%;
  overflow: auto;
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
      margin-left: pxToRem(10);

      .sr-icon {
        width: 100%;
        height: 100%;
      }
    }

    .sr-picture {
      width: 25%;
      min-width: pxToRem(50);
      aspect-ratio: 1/1;
      flex-shrink: 0;
      margin-right: pxToRem(20);
      margin-bottom: auto;
    }

    &-info {
      width: 100%;

      .sr-text {
        &:not(.subtitle) {
          font-size: pxToRem(12);
        }
      }

      .price-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;

        .discount {
          color: $color-quivi-red;
          text-decoration: line-through;
          margin-left: auto;
          margin-right: pxToRem(10);
          margin-top: auto;
        }
        .price {
          margin-left: auto;
        }
      }
    }
  }

  &-qty {
    display: flex;
    gap: pxToRem(10);
    margin: auto;
    width: 100%;
    justify-content: center;
    padding: pxToRem(10) 0;
    button {
      font-weight: bold;
      width: pxToRem(30);
      flex-shrink: 0;
      appearance: none;
      border: none;
      border-radius: pxToRem(5);
      color: $color-white;
      background: $color-quivi-green;
      text-align: center;
    }
    .sr-form-input {
      width: pxToRem(50);
      border-radius: pxToRem(5);
      border: {
        style: solid;
        color: $color-quivi-gray;
        width: pxToRem(2);
      }
      text-align: center;

      &[type="number"]::-webkit-outer-spin-button,
      &[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
      }
    }
  }
}
</style>
