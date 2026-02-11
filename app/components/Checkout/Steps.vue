<template lang="pug">
ul(class="flex p-5 mb-5")
  li(class="flex items-center flex-1"
    v-for="(step, i) in  stepsState"
    :key="i"
    :class="[step.active ? 'opacity-100' : 'opacity-50', i !== stepsState.length - 1 ? 'mr-5' : '']"
  )
    button(
      class="appearance-none flex items-center justify-center flex-col w-full bg-transparent border-0 hover:underline"
      @click="setStepHandler(i)"
      :disabled="!step.enabled"
    )
      p {{ step.label }}
      span(class="w-full h-1" :class="step.done ? 'bg-[var(--color-quivi-green)]' : 'bg-[var(--color-quivi-gray)]'")
</template>

<script lang="ts" setup>
const { stepsState, setStep } = useCheckout();

const setStepHandler = (idx: number) => {
  const currentIdx = stepsState.value.findIndex((step) => step.active);
  if (currentIdx < idx) return;
  setStep(idx);
};
</script>
