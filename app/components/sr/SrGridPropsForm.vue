<template>
  <div class="sr-grid-form">
    <UFormField label="Class">
      <UInput v-model="state.css.class" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

const props = defineProps({
  gridElement: { type: Object, default: () => ({ css: { class: "" } }) },
  responsive: { type: String, default: "" },
});

const emit = defineEmits(["update:grid-element"]);

const state = reactive({ ...props.gridElement });

watch(state, (val) => emit("update:grid-element", { ...val }), {
  deep: true,
});
</script>
