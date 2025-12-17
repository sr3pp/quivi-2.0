<template>
  <UPageColumns
    :as="tag"
    class="sr-grid-col"
    :class="css.class"
    :style="{ ...css.style, ...columnStyle }"
  >
    <slot />
  </UPageColumns>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: Object,
    default: () => ({ mobile: "1" }),
  },
  tag: {
    type: String,
    default: "div",
  },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});

const fractionToPercent = (value?: string) => {
  if (!value || value === "1") return "100%";
  if (value.includes("/")) {
    const [num, den] = value.split("/");
    const n = Number(num);
    const d = Number(den);
    if (d > 0) {
      return `${(n / d) * 100}%`;
    }
  }
  return "100%";
};

const columnStyle = computed(() => {
  const width = fractionToPercent((props.size as any).mobile);
  return { width, maxWidth: width };
});
</script>
