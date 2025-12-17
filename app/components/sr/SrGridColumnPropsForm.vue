<template>
  <div class="sr-grid-column-form">
    <UFormField label="Mobile size">
      <UInput v-model="state.size.mobile" />
    </UFormField>
    <UFormField label="Class">
      <UInput v-model="state.css.class" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

const props = defineProps({
  columnElement: {
    type: Object,
    default: () => ({ size: { mobile: "1" }, css: { class: "" } }),
  },
  responsive: { type: String, default: "" },
});

const emit = defineEmits(["update:column-element"]);

const state = reactive({ ...props.columnElement });

watch(state, (val) => emit("update:column-element", { ...val }), {
  deep: true,
});
</script>
