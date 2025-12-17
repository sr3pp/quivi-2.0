<template>
  <UAccordion
    v-model="accordionValue"
    :items="[{ label, value: 'item' }]"
    type="single"
    collapsible
    class="sr-accordion"
    :class="css.class"
    :style="css.style"
  >
    <template #default="{ open: slotOpen }">
      <button type="button" class="sr-accordion-label" @click="toggle">
        <slot name="label" />
        {{ label }}
        <div class="sr-accordion-label-chevron" :class="{ open: slotOpen }">
          <UIcon name="i-heroicons-chevron-down" />
        </div>
      </button>
    </template>
    <template #content>
      <div class="sr-accordion-content">
        <slot name="content" />
        <slot />
      </div>
    </template>
  </UAccordion>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  isOpen: { type: Boolean, default: false },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});

const emit = defineEmits(["toggle"]);

const accordionValue = ref<string | undefined>(
  props.isOpen ? "item" : undefined,
);

const toggle = () => {
  accordionValue.value = accordionValue.value ? undefined : "item";
  emit("toggle", { key: "open", value: Boolean(accordionValue.value) });
};

defineExpose({
  toggle,
  close: () => (accordionValue.value = undefined),
  openAccordion: () => (accordionValue.value = "item"),
});
</script>

<style scoped>
.sr-accordion-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.sr-accordion-label-chevron {
  transition: transform 0.2s ease;
}
.sr-accordion-label-chevron.open {
  transform: rotate(180deg);
}
.sr-accordion-content {
  padding-block: 8px;
}
</style>
