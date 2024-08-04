<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";
import type { Cart, Product } from "~/types";
import "swiper/css";

import "swiper/css/pagination";

const { params } = useRoute();
const { _id } = params;

const { data: product }: any = await useFetch<Product>(`/api/product/${_id}`);

const relatedProducts = await $fetch(
  `/api/product/related?brand=${product.value?.brand._id}`,
);

const { data: existences }: any = await $fetch(
  `/api/product/get-existences?sae=${product.value.sae}&type=${product.value.meassure_unity || "P"}`,
);
product.value.existences = existences;
product.value.qty = 1;

const qty = ref(product.value.qty);

const detailExcludes = [
  "__v",
  "discount",
  "description",
  "_id",
  "name",
  "price",
  "thumbs",
  "web",
  "priority",
  "sae",
  "createdAt",
  "updatedAt",
];

const { cart, addToCart } = useCart();

const updateQty = (value: number) => {
  if (!product.value.qty) product.value.qty = 1 + value;
  else product.value.qty += value;
};

const sliderOptions = {
  slidesPerView: "auto",
  spaceBetween: 0,
  centeredSlides: true,
  autoplay: true,
  loop: true,
  creative: {
    prev: {
      shadow: false,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
  },
  breakpoints: {
    744: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 4,
    },
  },
};

const printValue = (value: any) => {
  if (Array.isArray(value)) {
    if (typeof value[0] === "object") {
      return value.map((v: any) => v.name).join(", ");
    } else {
      return value.join(", ");
    }
  } else if (typeof value === "object") {
    return value.name;
  } else {
    return String(value);
  }
};

const setTotal = (value: number) => {
  product.value.qty = value;
};
</script>

<template lang="pug">
.product-detail

    SrContainer(:with-padding="true")
        SrGrid
            SrGridColumn(:size="{mobile: '1', sm: '2/5'}")
              ProductThumbs(:thumbs="product.thumbs" :productName="product.name" :productId="product.web")
            SrGridColumn(:size="{mobile: '1', sm: '3/5'}")
                .product-detail-info(v-if="product")
                    SrText(:text="product.name" class="title")
                    SrText(:text="`Refaccion: ${product.web}`" class="subtitle")
                    SrText(:text="product.extra")

                    .product-detail-price
                        .price-container
                          SrText(:text="toPrice(processDiscount(product))" class="title" v-if="product.discount")
                          SrText.discount(:text="toPrice(product.price)" class="subtitle")
                        .product-detail-no-existences(v-if="!existences")
                          SrText(text="Producto no disponible")
                          QuiviButton(label="Solicitar información" size="lg" variant="secondary")
                        .product-detail-existences(v-else)
                          Incrementor(:qty="qty" :max="product.existences" @updateQty="($event) => qty += $event")
                          QuiviButton(v-if="product.qty > product.existences" label="Verificar existencias" size="lg" variant="secondary")
                    .product-detail-actions
                        QuiviButton(@click="addToCart(product, qty)" label="Agregar al carrito" :disabled="existences > 0 && product.qty <= product.existences ? false : true")
                        QuiviButton(href="/tienda" label="Ir a la tienda" :loading="false" :disabled="false")
            SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="column")
                SrText(text="ESPECIFICACIONES DEL PRODUCTO" class="title")
                ul.product-detail-details
                    template(v-for="([key, value], i) in Object.entries(product)")
                        li.product-detail-detail(v-if="!detailExcludes.includes(key)" :key="i")
                            SrText.label(:text="`${key}:`")
                            SrText(:text="printValue(value)")
            SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="column")
                SrText(text="DESCRIPCION DEL PRODUCTO" class="title")
                SrText(:text="product.description")

    SrContainer(:with-padding="true")
        SrText(value="PRODUCTOS RELACIONADOS" class="title")
    SliderProducts(:options="sliderOptions" :products="relatedProducts")
</template>

<style lang="scss" scoped>
.product-detail {
  &-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(20);
      }
    }
  }

  &-price {
    display: flex;
    justify-content: space-between;

    .price-container {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .discount {
      color: $color-quivi-red;
      text-decoration: line-through;
    }
  }

  &-actions {
    display: flex;
  }

  &-detail {
    display: flex;

    &:not(:last-child) {
      margin-bottom: pxToRem(10);
    }

    .label {
      margin-right: pxToRem(6);
      font-weight: bold;
      text-transform: capitalize;
    }
  }
  &-no-existences {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 50%;
    .sr-text {
      --text-align: center;
      &:not(:last-of-type) {
        margin-bottom: pxToRem(10);
      }
    }
  }
}
</style>
