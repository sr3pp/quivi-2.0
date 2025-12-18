<template>
  <span class="sr-icon" :class="css.class" :style="css.style">
    <UIcon v-if="iconifyName" :name="iconifyName" />
    <svg v-else class="sr-icon-sprite">
      <use :href="`${dir}/${name}.svg#s`"></use>
    </svg>
  </span>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  dir: { type: String, default: "/icons" },
  css: {
    type: Object,
    default: () => ({
      class: "",
      style: {},
    }),
  },
});

const iconifyName = computed(() =>
  props.name && props.name.includes(":") ? props.name : "",
);
</script>

<style scoped>
.sr-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sr-icon-sprite {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
