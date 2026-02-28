<template lang="pug">
div(class="relative min-h-[80vh]")
  UContainer.py-10
    div(
      v-if="verifyingPayment"
      class="fixed inset-0 z-[3] flex items-center justify-center bg-[rgba(255,255,255,0.5)] backdrop-blur-[5px]"
    )
      p Verificando Pago...
    UPageGrid(v-else)
        div(class="col-span-1 sm:col-span-8" class="column")
          CheckoutSteps
          ClientOnly
            TransitionGroup(name="fade")
              CheckoutInfo(v-show="stepsState[0].active" :sat="sat" key="1")
              CheckoutPayment(v-show="stepsState[1].active" key="2")
              CheckoutResume(v-show="stepsState[2].active" :sat="sat" key="3")
                    
        div(class="col-span-1 sm:col-span-4 sticky top-10 flex flex-col justify-center gap-5")
          ClientOnly
              CartList.mb-auto.mt-10(:products="cart.products" :editable="false" class="[&_ul]:max-h-[40vh]")
              CartDetail(:total="cart.total" :subtotal="cart.subtotal" :shipping="cart.shipping" :qty="totalCartProducts")
          UButton.mx-auto(label="Pagar" :disabled="!paymentLock" kind="primary" @click="termsModalSw = true")
    UModal(v-model:open="termsModalSw")
      template(#title)
        p Para continuar acepta los términos y condiciones
      template(#body)
        Terms.mb-4(:terms="terms.sections")
        UCheckbox(v-model="termsSw" size="lg" label="Acepta los términos y condiciones para proceder al pago" class="mb-5 flex items-center justify-center text-xs")
      template(#footer)
        p(class="mb-5 text-center text-xs" v-html="termsLegend2")
        UButton(class="mx-auto" label="Pagar" @click="processPayment" :disabled="!termsSw" :loading="loadingPayment")
</template>

<script lang="ts" setup>
const { cart, totalCartProducts } = useCart();

const { stepsState, paymentLock } = useCheckout();

const { data: terms } = await useNuxtData("config-terms");
const { data: sat } = await useAsyncData("config-sat", () => queryCollection("configSat").first());

const {
  loadingPayment,
  verifyingPayment,
  termsModalSw,
  termsSw,
  termsLegend2,
  processPayment,
  initCheckoutPayment,
} = useCheckoutPayment();

onMounted(() => {
  initCheckoutPayment();
});
</script>
