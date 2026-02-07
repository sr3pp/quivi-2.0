<template lang="pug">
UCard(:ui="{ header: 'p-0 sm:px-0', footer: 'flex justify-between items-center' }")
  template(#header)
    figure.w-full
      NuxtImg.w-full(:src="`/products/${product.web}/${product.thumbs[0]}`" :alt="product.name")
  div
    p {{ product.name }}
    p.sae {{ `Clave: ${product.sae}` }}
    p(v-if="!product.discount") {{ toPrice(product.price) }}
    p(v-else) {{ toPrice(processDiscount(product)) }}
  template(#footer)
    UButton(:href="`/producto/${product._id}`" size="xl" label="Ver Mas" color="secondary" :loading="false" :disabled="false")
    UTooltip(:text="product.extra" :content="{align: 'end',side: 'top',sideOffset: 2}")
      UButton(icon="i-lucide-info" aria-label="Detalles")
                

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