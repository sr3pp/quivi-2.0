<template lang="pug">
ul.quivi-cart-list 
    li.quivi-cart-list-product(v-for="(product, i) in products" :key="i")
        SrPicture(:src="`/products/${product.brand._id}/${product.thumbs[0]}`" :alt="product.name")
        .quivi-cart-list-product-info
            SrText(:text="product.name" class="subtitle")
            SrText(:text="`Marca: ${product.brand.name}`")
            SrText(:text="`Web: ${product.web}`")
            Incrementor(v-if="editable" :qty="product.qty" @updateQty="updateQty(product, $event)" :max="product.existences")
            SrText(v-else :text="`Qty: ${String(product.qty)}`")
            .price-container
                SrText.discount(:text="toPrice(product.price)")
                SrText.price(:text="toPrice(processDiscount(product))" class="subtitle" v-if="product.discount")
        button(@click="removeFromCart(product)" v-if="editable")
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
}
</style>
