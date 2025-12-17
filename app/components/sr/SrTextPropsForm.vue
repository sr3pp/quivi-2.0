<template>
  <div class="sr-text-form">
    <UForm class="sr-text-form-fields">
      <UFormField label="Text" class="w-full">
        <UInput v-model="state.text" />
      </UFormField>
      <UFormField label="Class" class="w-full">
        <UInput v-model="state.css.class" />
      </UFormField>
    </UForm>
    <UButton
      v-if="responsive"
      size="sm"
      variant="ghost"
      @click="$emit('clear-breakpoint', responsive)"
    >
      Clear breakpoint
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

const props = defineProps({
  textElement: { type: Object, default: () => ({ css: { class: "" } }) },
  responsive: { type: String, default: "" },
});

const emit = defineEmits(["clear-breakpoint", "update:text-element"]);

const state = reactive({ ...props.textElement });

watch(state, (val) => emit("update:text-element", { ...val }), {
  deep: true,
});
</script>

<style scoped>
.sr-text-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sr-text-form-fields {
  display: grid;
  gap: 8px;
}
</style>
