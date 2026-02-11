<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";
import type { Cart, Product } from "~/types";

const { params } = useRoute();
const { _id } = params;

const productId = Array.isArray(_id) ? _id[0] : _id;

const { data: product } = await useAsyncData<Product>(
  `product-${productId}`,
  () => $fetch(`/api/product/${productId}` as string),
);

const relatedProducts = await $fetch(
  `/api/product/related?productId=${product.value?._id}` as string,
);

const existences = await $fetch<number>(
  `/api/product/get-existences?sae=${product.value.sae}&type=${product.value.meassure_unity || "P"}` as string,
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

const printValue = (value: unknown) => {
  if (Array.isArray(value)) {
    if (typeof value[0] === "object" && value[0] !== null) {
      return value
        .map((v) =>
          typeof v === "object" && v && "name" in v
            ? String((v as { name?: string }).name ?? "")
            : String(v),
        )
        .join(", ");
    } else {
      return value.join(", ");
    }
  } else if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name?: string }).name ?? "");
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

                    .flex.justify-between.gap-4
                        .flex.flex-col.gap-2
                          p(v-if="product.discount && product.discount > 0" class="title") {{ toPrice(processDiscount(product)) }}
                          p.line-through.text-primary-dark(:class="{'subtitle discount': product.discount && product.discount > 0, 'title': !product.discount || product.discount == 0}") {{ toPrice(product.price) }}
                        .flex.flex-col.gap-1(v-if="!existences")
                          p.text-sm PRODUCTO NO DISPONIBLE
                          UButton.text-center.justify-center(size="lg") Solicitar información
                        div(v-else)
                          UInputNumber(v-model="qty" :max="product.existences" @updateQty="($event) => qty += $event")
                          UButton(v-if="qty == product.existences" label="Verificar existencias" size="lg" color="secondary")
                    .flex.justify-between
                        UButton(@click="addToCart(product, qty)" label="Agregar al carrito" :disabled="existences > 0 && product.qty <= product.existences ? false : true")
                        UButton(to="/tienda" label="Ir a la tienda" :loading="false" :disabled="false" color="secondary")
            div.flex.flex-col.gap-2(class="col-span-12 sm:col-span-6")
                p.font-bebas.text-3xl ESPECIFICACIONES DEL PRODUCTO
                ul.flex.flex-col.gap-1
                    template(v-for="([key, value], i) in Object.entries(product)")
                        li.product-detail-detail(v-if="!detailExcludes.includes(key)" :key="i")
                            SrText.label(:text="`${getLabel(key)}:`")
                            SrText(:text="printValue(value)")
            div.flex.flex-col.gap-2(class="col-span-12 sm:col-span-6")
                p.font-bebas.text-3xl DESCRIPCION DEL PRODUCTO
                p {{ product.description }}

    UContainer.py-10(:with-padding="true")
        p.font-bebas.text-3xl PRODUCTOS RELACIONADOS
    UCarousel(v-if="relatedProducts.length" :items="relatedProducts" :arrows="relatedProducts.length > 4" :dots="false" :ui="{ item: 'basis-full sm:basis-1/3' }")
      template(#default="{ item }")
        ProductCard(:product="item")
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
