<template>
  <UModal
    v-model:open="open"
    :fullscreen="layout === 'full'"
    :class="['sr-modal', layout, css.class]"
    :style="css.style"
    @after-enter="emit('toggled', open)"
    @after-leave="emit('toggled', open)"
  >
    <template #header>
      <slot name="header" />
    </template>
    <template #body>
      <slot name="body" />
    </template>
    <template #actions>
      <slot name="footer" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  layout: { type: String, default: "" },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});

const emit = defineEmits(["toggled"]);
const open = ref(false);

const toggle = () => {
  open.value = !open.value;
};

defineExpose({ toggle, isOpen: open });
</script>
