<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";
import type { Cart, Product } from "~/types";
import "swiper/css";

import "swiper/css/pagination";

const { params } = useRoute();
const { _id } = params;

const { data: product }: any = await useFetch<Product>(`/api/product/${_id}`);

const relatedProducts = await $fetch(
  `/api/product/related?productId=${product.value?._id}`,
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
  "qty",
  "existences",
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

const getLabel = (key: string) => {
  const labels: Record<string, string> = {
    brand: "Marca",
    car_brands: "Marcas de autos",
    category: "Categoría",
    extra: "Extra",
    line: "Línea",
    meassure_unity: "Unidad de medida",
    models: "Modelos",
    motors: "Motores",
    segment: "Segmento",
    subcategory: "Subcategoría",
    years: "Años",
    existences: "Existencias",
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
};
</script>

<template lang="pug">
    UContainer.py-10
        UPageGrid
            div(class="col-span-1 sm:col-span-6")
              ProductThumbs(:thumbs="product.thumbs" :productName="product.name" :productId="product.web")
            div(class="col-span-1 sm:col-span-6")
                .flex.flex-col.gap-6(v-if="product")
                    p {{ product.name }}
                    p {{ `Refaccion: ${product.web}` }}
                    p {{ product.extra }}

                    .product-detail-price
                        .price-container
                          p(v-if="product.discount && product.discount > 0" class="title") {{ toPrice(processDiscount(product)) }}
                          p(:class="{'subtitle discount': product.discount && product.discount > 0, 'title': !product.discount || product.discount == 0}") {{ toPrice(product.price) }}
                        .flex.flex-col.gap-1(v-if="!existences")
                          p.text-sm PRODUCTO NO DISPONIBLE
                          UButton(label="Solicitar información" size="lg")
                        .product-detail-existences(v-else)
                          UInputNumber(v-model="qty" :max="product.existences" @updateQty="($event) => qty += $event")
                          UButton(v-if="qty == product.existences" label="Verificar existencias" size="lg" color="secondary")
                    .flex.justify-between
                        UButton(@click="addToCart(product, qty)" label="Agregar al carrito" :disabled="existences > 0 && product.qty <= product.existences ? false : true")
                        UButton(to="/tienda" label="Ir a la tienda" :loading="false" :disabled="false" color="secondary")
            div(class="col-span-1")
                p ESPECIFICACIONES DEL PRODUCTO
                ul.product-detail-details
                    template(v-for="([key, value], i) in Object.entries(product)")
                        li.product-detail-detail(v-if="!detailExcludes.includes(key)" :key="i")
                            SrText.label(:text="`${getLabel(key)}:`")
                            SrText(:text="printValue(value)")
            div(class="col-span-1 sm:col-span-2")
                p.title DESCRIPCION DEL PRODUCTO
                p {{ product.description }}

    UContainer(:with-padding="true")
        p PRODUCTOS RELACIONADOS
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
    text-transform: uppercase;

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
