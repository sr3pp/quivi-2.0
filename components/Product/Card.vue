<template lang="pug">
.quivi-product-card
    figure.quivi-product-card-img
        img(:src="product.thumbs[0]" :alt="product.name")
    .quivi-product-card-body
        SrText(:text="product.name" kind="title")
        SrText.sae(:text="`Clave: ${product.sae}`")
        SrText(:text="processDiscount(product)" kind="title")
        SrText.discount(:text="toPrice(product.price)" kind="subtitle" v-if="product.discount")
    .quivi-product-card-footer
        Button(:href="`/producto/${product.web}`" label="Ver Mas")
        Tooltip
            SrText(:text="product.extra")
                

</template>

<script lang="ts" setup>
import type { Product } from "~/types";
import { processDiscount, toPrice } from "~/assets/ts/utilities/index";

defineProps({
  product: {
    type: Object as () => Product,
    default: (): Product => ({
      name: "Preview",
      web: "prev32394",
      sae: "nononoSae",
      qty: 10,
      priority: 1,
      price: 200,
      thumbs: [
        "https://picsum.photos/300",
        "https://picsum.photos/300",
        "https://picsum.photos/300",
      ],
      description: "Lorem simpsum",
      extra: "producto en promocion",
      meassure_unity: "kg",
      line: "",
      discount: 0,
      years: [],
      category: {},
      subcategory: {},
      car_brands: [],
      brand: {},
      models: [],
      segment: {},
      motors: [],
    }),
  },
});
</script>

<style lang="scss" scoped>
.quivi-product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  width: 100%;
  border: {
    width: pxToRem(2);
    color: $color-quivi-light-red;
    style: solid;
  }
  border-radius: pxToRem(10);
  margin-bottom: pxToRem(20);
  &-img {
    width: 100%;
    height: pxToRem(200);
    margin-bottom: pxToRem(20);
    margin-top: 0;
    overflow: hidden;
    box-shadow: pxToRem(10) pxToRem(10) pxToRem(0) rgba(0, 0, 0, 0);
    transition: box-shadow 0.35s ease;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }
  }

  &:hover {
    .quivi-product-card {
      &-img {
        box-shadow: pxToRem(10) pxToRem(10) pxToRem(20) rgba(0, 0, 0, 0.25);
        img {
          transform: scale(1.1);
        }
      }
    }
  }

  &-body {
    padding-right: pxToRem(20);
    padding-left: pxToRem(20);
    width: 100%;

    .sr-text,
    .sae {
      margin-bottom: pxToRem(10);
    }

    .discount {
      color: $color-quivi-red;
      text-decoration: line-through;
    }
  }

  .quivi-tooltip {
    margin-left: auto;
  }

  &-footer {
    width: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    padding: pxToRem(20);
  }
}
</style>
