<template>
  <UButton
    :as="tag"
    :to="href || undefined"
    :disabled="disabled"
    :class="['sr-button', css.class]"
    :style="{ ...css.style }"
  >
    {{ label }}
    <slot />
  </UButton>
</template>

<script lang="ts" setup>
defineProps({
  tag: { type: String, default: "button" },
  href: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: "" },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});
</script>
