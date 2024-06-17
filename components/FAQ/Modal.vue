<script setup lang="ts">
defineProps({
  faqs: {
    type: Array,
    default: () => [],
  },
});

const faqModal: any = ref(null);

defineExpose({
  toggleFaqModal: () => {
    faqModal.value.toggle();
  },
});
</script>

<template lang="pug">
SrModal.faq-modal(ref="faqModal")
  template(#header)
      SrText(text="FAQ's" class="title")
  template(#body)
    ul.faq-list
      li.faq-list-item(v-for="faq in faqs" :key="'faq-' + new Date().getTime()")
        SrText(:text="faq.question" class="subtitle")
        SrText.answer(:html="faq.answer")
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
