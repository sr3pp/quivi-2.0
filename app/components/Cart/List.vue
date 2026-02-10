<template lang="pug">
ul.flex.flex-col.gap-4
    li.flex.gap-2(v-for="(product, i) in products" :key="i")
        ProductImage(:product="product" class="size-30 aspect-squeare object-cover flex-grow-0")
        .flex.flex-col.gap-2.text-sm
            p {{ product.name }}
            p.flex.justify-between 
              span {{ `Marca: ${product.brand.name}` }}
              span {{ `Web: ${product.web}` }}
            .flex.justify-between
              UInputNumber(v-if="editable" v-model="product.qty" :max="product.existences")
              span(v-if="product.qty == product.existences") Limite de stock, contactanos si necesitas más
            .flex.justify-between
                p.font-bold(:class="{'line-through text-primary-dark': product.discount && product.discount > 0}") {{ toPrice(product.price) }}
                p.font-bold(v-if="product.discount && product.discount > 0") {{ toPrice(processDiscount(product)) }}
        button.size-4.text-primary(@click="removeFromCart(product)" v-if="editable")
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
