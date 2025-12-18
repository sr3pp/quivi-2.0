<template>
  <div class="sr-preview" :class="css" :style="style">
    <component
      :is="component.component"
      v-for="(component, i) in content"
      :key="i"
      v-bind="component.props"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  appComponents: { type: Object, default: () => ({}) },
  content: { type: Array as PropType<any[]>, default: () => [] },
  responsive: { type: String, default: "" },
  css: { type: String, default: "" },
  style: { type: Object, default: () => ({}) },
  prefix: { type: String, default: "" },
});
</script>

<style scoped>
.sr-preview {
  width: 100%;
  height: 100%;
}
</style>
