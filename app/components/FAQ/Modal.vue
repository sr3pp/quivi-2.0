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
UModal.faq-modal(v-model:open="modalSw")
  template(#header)
      p FAQ's
  template(#content)
    ul.faq-list
      li.faq-list-item(v-for="(faq, i) in faqs" :key="'faq-'+ i + new Date().getTime()")
        p.faq-question {{ faq.question }}
        p.faq-answer(v-html="faq.answer")
</template>

<style lang="scss" scoped>
.faq-modal {
  .sr-modal-header {
    .title {
      padding: pxToRem(20);
      padding-bottom: 0;
    }
  }

  .faq-list {
    border-radius: pxToRem(10);
    overflow: hidden;
    &-item {
      padding: pxToRem(20);
      &:nth-child(even) {
        background-color: $color-quivi-light-gray;
        color: $color-white;
      }
      .answer {
        padding-left: pxToRem(20);
      }
    }
  }
}
</style>
