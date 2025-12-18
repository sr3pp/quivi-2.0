<template>
  <UFormField
    :class="['sr-form-input', css.class]"
    :style="css.style"
    :label="label"
    :help="error || info || hint"
    :error="Boolean(error)"
    :hint="info || hint"
    :required="required"
  >
    <component
      :is="type === 'textarea' ? 'UTextarea' : 'UInput'"
      v-model="localValue"
      :name="name"
      :type="type === 'textarea' ? undefined : type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :step="step || undefined"
    />
  </UFormField>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  name: { type: String, default: "" },
  type: { type: String, default: "text" },
  hint: { type: String, default: "" },
  error: { type: String, default: "" },
  info: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
  step: { type: String, default: "" },
});

const emit = defineEmits(["input", "update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
    emit("input", value);
  },
});
</script>
