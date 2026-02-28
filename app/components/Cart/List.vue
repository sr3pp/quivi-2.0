<template lang="pug">
ul.flex.flex-col.gap-4
    li.flex.gap-2.justify-center(v-for="(product, i) in products" :key="i")
        ProductImage(:product="product" class="size-30 sm:size-50 md:size-60 aspect-squeare object-cover flex-grow-0")
        .flex.flex-col.gap-2.text-sm
            p {{ product.name }}
            p.flex.justify-between 
              span {{ `Marca: ${product.brand.name}` }}
              span {{ `Web: ${product.web}` }}
            .flex.justify-between
              UInputNumber(v-if="editable" v-model="product.qty" :max="product.existences")
              span(v-if="product.qty == product.existences") Limite de stock, contactanos si necesitas más
            .flex.justify-between
                p.font-bold(:class="{'line-through text-primary-dark': product.discount && product.discount > 0}") {{ toPrice(product.price) }}
                p.font-bold(v-if="product.discount && product.discount > 0") {{ toPrice(processDiscount(product)) }}
        button.size-4.text-primary(@click="removeFromCart(product)" v-if="editable")
            SvgIcon(name="trash-o")
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

const { removeFromCart, updateQty } = useCart();
</script>
