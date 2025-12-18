<template>
  <URadioGroup
    v-if="type === 'radio'"
    v-model="localValue"
    :items="radioItems"
    :name="name || undefined"
    :required="required"
    orientation="horizontal"
    :class="['sr-form-box', css.class]"
    :style="css.style"
  />
  <UCheckbox
    v-else
    v-model="checkboxValue"
    :label="label"
    :name="name || undefined"
    :disabled="disabled"
    :required="required"
    :class="['sr-form-box', css.class]"
    :style="css.style"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  type: { type: String, default: "checkbox" },
  name: { type: String, default: "sr" },
  value: { type: [String, Number, Boolean], default: "" },
  modelValue: { type: [String, Number, Boolean], default: "" },
  required: { type: Boolean, default: false },
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

const checkboxValue = computed({
  get: () => Boolean(props.modelValue),
  set: (value: boolean) => emit("update:modelValue", value),
});

const radioItems = computed(() => [
  {
    label: props.label || String(props.value),
    value: props.value,
    disabled: props.disabled,
  },
]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
