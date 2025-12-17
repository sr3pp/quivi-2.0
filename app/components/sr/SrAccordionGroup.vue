<template>
  <ol class="sr-accordion-group" :class="css.class" :style="css.style">
    <slot />
    <li
      v-for="(accordion, i) in content"
      :key="i"
      class="sr-accordion-group-item"
    >
      <SrAccordion
        ref="accordionGroupEl"
        v-bind="accordion.props"
        @toggle="toggleAccordions(i)"
      />
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { ref, type PropType } from "vue";
import SrAccordion from "./SrAccordion.vue";

const props = defineProps({
  content: { type: Array as PropType<any[]>, default: () => [] },
  closeAll: { type: Boolean, default: false },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});

const accordionGroupEl = ref<any[]>([]);

const toggleAccordions = (idx: number) => {
  accordionGroupEl.value.forEach((accordion, i) => {
    if (!accordion) return;
    if (idx !== i) {
      accordion.close();
    } else if (idx === i && !props.closeAll) {
      accordion.openAccordion();
    }
  });
};
</script>

<style scoped>
.sr-accordion-group-item + .sr-accordion-group-item {
  margin-top: 12px;
}
</style>
