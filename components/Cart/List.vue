<template lang="pug">
ul.quivi-cart-products 
    li.quivi-cart-product(v-for="(product, i) in products" :key="i")
        SrPicture(:src="`/products/${product.brand._id}/${product.thumbs[0]}`" :alt="product.name")
        .quivi-cart-product-info
            SrText(:text="product.name" class="subtitle")
            SrText(:text="product.brand.name")
            SrText(:text="product.web")
            SrFormInput(v-if="editable" :value="product.qty" type="number" @change="setTotal" @input="product.qty = $event.target.value" :min="1" :max="100")
            SrText(v-else :text="product.qty")
            .price-container
                SrText.discount(:text="toPrice(product.price)")
                SrText.price(:text="processDiscount(product)" class="subtitle" v-if="product.discount")
        button(@click="removeProduct(product)" v-if="editable")
            SrIcon(name="trash-o")
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
