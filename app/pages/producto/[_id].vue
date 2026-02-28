<script lang="ts" setup>
import { toPrice, processDiscount } from "~/assets/ts/utilities";
import type { Product } from "~/types";

const { params } = useRoute();
const { _id } = params;

const productId = Array.isArray(_id) ? _id[0] : _id;
const productPath = `/api/product/${String(productId ?? "")}`;

const { data: product } = await useAsyncData<Product>(
  `product-${productId}`,
  () => $fetch<Product>(productPath),
);

type ProductPageData = Product & {
  qty: number;
  existences: number;
  sae: string;
  meassure_unity?: string;
};

const productData = product.value as ProductPageData | undefined;
if (!productData) {
  throw createError({
    statusCode: 404,
    statusMessage: "Producto no encontrado",
  });
}

const relatedProducts = await $fetch<Product[]>("/api/product/related", {
  query: { productId: String(productData._id ?? "") },
});

const {data: existences} = await $fetch<{data: number}>("/api/product/get-existences", {
  query: {
    sae: String(productData.sae ?? ""),
    type: productData.meassure_unity || "P",
  },
});
productData.existences = existences;
productData.qty = 1;

const qty = ref<number>(productData.qty);

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
  const nextQty = qty.value + value;
  qty.value = nextQty;
  productData.qty = nextQty;
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
  productData.qty = value;
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
  div
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
                p.label {{ getLabel(key) }}:
                p {{ printValue(value) }}
        div.flex.flex-col.gap-2(class="col-span-12 sm:col-span-6")
          p.font-bebas.text-3xl DESCRIPCION DEL PRODUCTO
          p {{ product.description }}

    UContainer.py-10(:with-padding="true")
      p.font-bebas.text-3xl PRODUCTOS RELACIONADOS
    UCarousel(v-if="relatedProducts.length" :items="relatedProducts" :arrows="relatedProducts.length > 4" :dots="false" :ui="{ item: 'basis-full sm:basis-1/3' }")
      template(#default="{ item }")
        ProductCard(:product="item")
</template>
