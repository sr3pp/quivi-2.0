<template lang="pug">
UDrawer(v-model:open="isOpen" direction="right")
  template(#header)
    button(@click="toggleCart" class="absolute left-0 top-0 translate-x-[-50%] translate-y-[20px] rounded-full bg-primary text-white border-none text-[20px] flex items-center justify-center")
      UIcon(name="ci:close-big") 
    button.quivi-cart-empty(@click="emptyCart" v-if="cart.products.length") Vaciar carrito
  template(#body)
      template(v-if="cart.products.length")
        CartList(:products="cart.products" :editable="true" @remove="removeFromCart")
      template(v-else)
        div.h-full.flex.flex-col.justify-center.items-center
          p.font-bebas.text-xl.text-center Tu carrito está vacío
  template(#footer)
    CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
</template>

<script lang="ts" setup>
const {
  active,
  toggleCart,
  removeFromCart,
  emptyCart,
  totalCartProducts,
  cart,
} = useCart();
const emit = defineEmits(["close"]);
const isOpen = ref(active.value);

watch(active, (value) => {
  if (value) {
    isOpen.value = true;
  } else {
    isOpen.value = false;
  }
});
</script>
