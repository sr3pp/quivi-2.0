<template>
  <UFormField
    :class="['sr-form-select', css.class]"
    :style="css.style"
    :label="label"
    :help="hint || info || warning || error"
    :error="Boolean(error)"
    :required="required"
  >
    <USelect
      v-model="localValue"
      :items="selectItems"
      :placeholder="placeholder || undefined"
      :name="name || undefined"
      :disabled="disabled"
    />
  </UFormField>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { PropType } from "vue";

interface SrSelectOption {
  name: string;
  value: string | number | boolean;
}

const props = defineProps({
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  modelValue: { type: [String, Number, Boolean], default: "" },
  required: { type: Boolean, default: false },
  options: {
    type: Array as PropType<SrSelectOption[]>,
    default: (): SrSelectOption[] => [],
  },
  error: { type: String, default: "" },
  hint: { type: String, default: "" },
  info: { type: String, default: "" },
  warning: { type: String, default: "" },
  name: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  css: {
    type: Object,
    default: () => ({
      style: {},
      class: "",
    }),
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectItems = computed(() =>
  props.options.map((option) => ({
    label: option.name,
    value: option.value,
  })),
);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
