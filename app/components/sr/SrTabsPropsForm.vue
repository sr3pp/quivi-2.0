<template>
  <div class="sr-tabs-form">
    <UFormField label="Active index">
      <UInput v-model.number="state.active" type="number" min="0" />
    </UFormField>
    <UFormField label="Class">
      <UInput v-model="state.css.class" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

const props = defineProps({
  tabsElement: {
    type: Object,
    default: () => ({ active: 0, css: { class: "" } }),
  },
  responsive: { type: String, default: "" },
});

const emit = defineEmits(["update:tabs-element"]);

const state = reactive({ ...props.tabsElement });

watch(state, (val) => emit("update:tabs-element", { ...val }), {
  deep: true,
});
</script>
