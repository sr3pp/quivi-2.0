<template lang="pug">
UDrawer(v-model:open="isOpen" direction="right")
  template(#header)
    button(@click="toggleCart" class="absolute left-0 top-0 translate-x-[-50%] translate-y-[20px] rounded-full bg-primary text-white border-none text-[20px] flex items-center justify-center")
      UIcon(name="ci:close-big") 
    UButton.ml-auto(@click="emptyCart" v-if="cart.products.length" color="neutral" variant="outline") Vaciar carrito
  template(#body)
      template(v-if="cart.products.length")
        CartList(:products="cart.products" :editable="true" @remove="removeFromCart")
      template(v-else)
        div.h-full.flex.flex-col.justify-center.items-center
          p.font-bebas.text-xl.text-center Tu carrito está vacío
  template(#footer)
    CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
    UButton(to="/tienda/checkout" label="Pagar" class="mx-auto")
</template>

<script lang="ts" setup>
const {
  active,
  toggleCart,
  removeFromCart,
  emptyCart,
  totalCartProducts,
  cart,
  setShippingConfig
} = useCart();
const emit = defineEmits(["close"]);
const isOpen = ref(active.value);

const { data: cartConfig } = await useAsyncData("config-shipping", () => queryCollection("configShipping").first());

if (cartConfig.value) {
  setShippingConfig({
    limite: cartConfig.value.limite as number || 0,
    costo: cartConfig.value.costo as number || 0,
  });
}

watch(active, (value) => {
  if (value) {
    isOpen.value = true;
  } else {
    isOpen.value = false;
  }
});
</script>
