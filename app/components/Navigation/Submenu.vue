<template lang="pug">
ol(
  v-if="children.length"
  class="flex flex-col overflow-hidden max-h-0 transition-[max-height,opacity,padding-top] duration-300 sm:absolute sm:left-0 sm:top-3.5 sm:min-w-[250px] sm:rounded-b-[18px] sm:bg-gradient-to-r sm:from-[var(--color-quivi-gray)] sm:to-[var(--color-quivi-darkest-gray)] sm:shadow-[0_10px_10px_rgba(51,47,46,0.3)] sm:group-hover:max-h-screen sm:group-hover:pt-7"
  :class="isActive ? 'max-h-screen' : ''"
  role="list"
)
  li(class="relative flex w-full" v-for="(child, idx) in children" :key="idx")
    NuxtLink(
      class="w-full text-[var(--color-white)] text-left text-[18px] leading-[1.8] capitalize px-5 py-4 sm:px-4 sm:justify-start sm:font-inria"
      :to="child.path"
    ) {{ child.title }}
</template>

<script lang="ts" setup>
import type { NavigationChild } from "./types";

const props = defineProps<{
  children?: NavigationChild[];
  parentStem?: string;
  isActive?: boolean;
}>();

const children = computed(() =>
  (props.children ?? []).filter(
    (child) =>
      child.stem !== props.parentStem &&
      !String(child.stem ?? "").endsWith("/index"),
  ),
);
</script>
