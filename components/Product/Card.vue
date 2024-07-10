<template lang="pug">
.quivi-product-card
  .quivi-product-card-container
    figure.quivi-product-card-img
        img(:src="`/products/${product._id}/${product.thumbs[0]}`" :alt="product.name")
    .quivi-product-card-body
        SrText(:text="product.name" class="title")
        SrText.sae(:text="`Clave: ${product.sae}`")
        SrText(:text="toPrice(processDiscount(product))" class="title")
        SrText.discount(:text="toPrice(product.price)" class="subtitle" v-if="product.discount")
    .quivi-product-card-footer
        QuiviButton(:href="`/producto/${product._id}`" label="Ver Mas")
        Tooltip(position="top-right")
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
      existences: 1,
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
  border: none;
  border-radius: pxToRem(10);
  margin-bottom: pxToRem(20);
  padding: pxToRem(4);
  background: $color-white;
  transition: transform 0.35s ease-in-out;

  &-container {
    position: relative;
    z-index: 1;
    width: 100%;
    background: $color-white;
    border-radius: pxToRem(10);
    overflow: hidden;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    border-radius: pxToRem(10);
    background: linear-gradient(
      to bottom,
      $color-quivi-light-red,
      $color-quivi-red
    );
    transition:
      box-shadow 0.35s ease,
      background 0.35s ease;
  }

  &-img {
    width: 100%;
    height: pxToRem(200);
    margin: 0;
    margin-bottom: pxToRem(20);
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
    transform: scale(1.03);
    &::before {
      box-shadow: pxToRem(10) pxToRem(10) pxToRem(20) rgba(0, 0, 0, 0.25);
      background: linear-gradient(
        to bottom,
        $color-quivi-red,
        $color-quivi-light-red
      );
    }
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
    flex-shrink: 0;
    width: pxToRem(40);
    height: pxToRem(40);
    font-size: pxToRem(16);
  }

  &-footer {
    width: 100%;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: pxToRem(20);

    .quivi-button {
      min-width: pxToRem(120);
      margin-left: 0;
    }
  }
}
</style>
