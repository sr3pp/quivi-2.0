<template lang="pug">
ul.quivi-cart-products 
    li.quivi-cart-product(v-for="(product, i) in products" :key="i")
        SrImg(:src="`/products/${product.brand._id}/${product.thumbs[0]}`" :alt="product.name")
        .quivi-cart-product-info
            SrText(:value="product.name" kind="subtitle")
            SrText(:value="product.brand.name")
            SrText(:value="product.web")
            SrFormInput(v-if="editable" :value="product.qty" type="number" @change="setTotal" @input="product.qty = $event.target.value" :min="1" :max="100")
            SrText(v-else :value="product.qty")
            .price-container
                SrText.discount(:value="toPrice(product.price)")
                SrText.price(:value="processDiscount(product)" kind="subtitle" v-if="product.discount")
        button(@click="removeProduct(product)" v-if="editable")
            SrIcon(value="trash-o")
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
const emit = defineEmits(["remove", "setTotal"]);
const removeProduct = (product: Product) => {
  emit("remove", product);
};

const setTotal = () => {
  emit("setTotal");
};
</script>

<style lang="scss">
.quivi-cart {
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
}
</style>
