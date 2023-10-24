<template lang="pug">
.product-detail
    SrContainer(:with_space="true")
        SrGrid
            .sr-grid-col-1(class="sr-grid-col-1/2")
                SrImg(:src="`/products/${product .web}/${product .thumbs[0]}`" :alt="product.name" width="100%" height="100%")
            .sr-grid-col-1(class="sr-grid-col-1/2")
                .product-detail-info(v-if="product")
                    SrText(:value="product.name" kind="title")
                    SrText(:value="`Refaccion: ${product.web}`")
                    SrText(:value="product.extra")

                    .product-detail-price
                        SrText(:value="toPrice(product.price)" kind="title")
                        SrText(value="Solicitar informacion")
                    .product-detail-actions
                        Button(@click="addToCart(product)" label="Agregar al carrito")
                        Button(href="/" label="Ir a la tienda")
            .sr-grid-col-1(class="sr-grid-col-1/2 column")
                SrText(value="ESPECIFICACIONES DEL PRODUCTO" kind="title")
                ul.product-detail-details
                    template(v-for="([key, value], i) in Object.entries(product)")
                        li.product-detail-detail(v-if="!detailExcludes.includes(key)" :key="i")
                            SrText.label(:value="`${key}:`")
                            SrText(:value="printValue(value)")
            .sr-grid-col-1(class="sr-grid-col-1/2 column")
                SrText(value="DESCRIPCION DEL PRODUCTO" kind="title")
                SrText(:value="product.description")

    SrContainer(:with_space="true")
        SrText(value="PRODUCTOS RELACIONADOS" kind="title")
    SliderProducts(:options="sliderOptions" :slidesEndpoint="`/api/product/hightlights?brand=${product.brand._id}`")
</template>

<script lang="ts" setup>
import { toPrice } from "~/assets/ts/utilities";

const { params } = useRoute();
const { web } = params;
const { data: product } = await useFetch(`/api/product/${web}`);

const detailExcludes = [
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

const cart = useLocalStorage("cart", {
  products: [],
  total: 0,
} as any);

const addToCart = () => {
  cart.value.products.push(product.value);
};

const sliderOptions = {
  slidesPerView: 4,
  spaceBetween: 30,
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
</script>

<style lang="scss" scoped>
.product-detail {
  &-info {
    width: 100%;
    > * {
      &:not(:last-child) {
        margin-bottom: unit(20);
      }
    }
  }

  &-price {
    display: flex;
    justify-content: space-between;
  }

  &-actions {
    display: flex;
  }

  &-detail {
    display: flex;

    &:not(:last-child) {
      margin-bottom: unit(10);
    }

    .label {
      margin-right: unit(6);
      font-weight: bold;
      text-transform: capitalize;
    }
  }
}
</style>
