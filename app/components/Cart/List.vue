<template lang="pug">
ul.quivi-cart-list 
    li.quivi-cart-list-product(v-for="(product, i) in products" :key="i")
        NuxtImg(:src="`/products/${product.web}/${product.thumbs[0]}`" :alt="product.name")
        .quivi-cart-list-product-info
            SrText(:text="product.name" class="subtitle")
            SrText(:text="`Marca: ${product.brand.name}`")
            SrText(:text="`Web: ${product.web}`")
            UInputNumber(v-if="editable" v-model="product.qty" :max="product.existences")
            span.quivi-cart-list-product-max-label(v-if="product.qty == product.existences") Limite de stock, contactanos si necesitas más
            SrText(:text="`Qty: ${String(product.qty)}`")
            .price-container
                SrText(:text="toPrice(product.price)" :class="{discount: product.discount && product.discount > 0}")
                SrText.price(:text="toPrice(processDiscount(product))" class="subtitle" v-if="product.discount && product.discount > 0")
        button(@click="removeFromCart(product)" v-if="editable")
            SvgIcon(name="trash-o")
</template>

<script lang="ts" setup>
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

const { removeFromCart, updateQty } = useCart();
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
      max-width: pxToRem(100);
      aspect-ratio: 1/1;
      flex-shrink: 0;
      margin-right: pxToRem(20);
      margin-bottom: auto;
    }

    &-max-label {
      font-size: pxToRem(10);
      color: $color-quivi-red;
      margin-left: auto;
      margin-right: pxToRem(10);
      margin-top: auto;
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
}
</style>
