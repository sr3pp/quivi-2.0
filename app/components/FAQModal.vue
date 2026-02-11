<script setup lang="ts">
defineProps({
  faqs: {
    type: Array,
    default: () => [],
  },
});

const modalSw = ref(false);

defineExpose({
  toggleFaqModal: () => {
    modalSw.value = !modalSw.value;
  },
});
</script>

<template lang="pug">
UModal(v-model:open="modalSw")
  template(#header)
      p.font-bebas.text-3xl.p-5.pb-0 FAQ's
  template(#body)
    ul(class="rounded-[10px] overflow-hidden")
      li(
        class="p-5"
        :class="i % 2 === 1 ? 'bg-[var(--color-quivi-light-gray)] text-[var(--color-white)]' : ''"
        v-for="(faq, i) in faqs"
        :key="'faq-'+ i + new Date().getTime()"
      )
        p {{ faq.question }}
        p(class="pl-5" v-html="faq.answer")
</template>
