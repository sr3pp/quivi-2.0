<script lang="ts" setup>
defineProps<{
  tag?: string;
  text: string;
  highlight?: string;
}>();
</script>

<template>
  <UContainer class="py-10">
    <TitleHighlight :tag="tag" :text="text" :highlight="highlight || ''" />
  </UContainer>
</template>
