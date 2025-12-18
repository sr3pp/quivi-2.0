<template>
  <UForm
    class="sr-form"
    :class="css.class"
    :style="css.style"
    @submit.prevent="submitForm"
  >
    <fieldset v-for="(fieldset, i) in fieldsets" :key="i">
      <legend v-if="fieldset.name">{{ fieldset.name }}</legend>
      <component
        :is="field.component"
        v-for="(field, j) in fieldset.fields"
        :key="j"
        v-bind="field.props"
        v-model="field.props.value"
      />
    </fieldset>
    <slot name="legal" />
    <UButton v-if="submit !== 'hidden'" type="submit" :class="submitClass">
      {{ submit }}
    </UButton>
    <slot name="submit" />
  </UForm>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

const props = defineProps({
  submit: { type: String, default: "Send" },
  submitClass: { type: String, default: "" },
  fieldsets: { type: Array as PropType<any[]>, default: () => [] },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});

const emit = defineEmits(["submit"]);

const submitForm = () => {
  emit("submit", props.fieldsets);
};
</script>
