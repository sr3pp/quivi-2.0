<template>
  <div class="sr-container-form">
    <UCheckbox v-model="state.contained" label="Contained" />
    <UCheckbox v-model="state.withPadding" label="With padding" />
    <UFormField label="Class">
      <UInput v-model="state.css.class" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

const props = defineProps({
  containerElement: {
    type: Object,
    default: () => ({
      contained: true,
      withPadding: false,
      css: { class: "" },
    }),
  },
  responsive: { type: String, default: "" },
});

const emit = defineEmits(["media-gallery", "update:container-element"]);

const state = reactive({ ...props.containerElement });

watch(state, (val) => emit("update:container-element", { ...val }), {
  deep: true,
});
</script>
