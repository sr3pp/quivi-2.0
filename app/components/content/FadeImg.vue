<script setup lang="ts">
defineProps<{
  src: string;
  alt: string;
  delay?: number;
}>();

const figureRef = ref<HTMLElement | null>(null);
const isVisible = useElementVisibility(figureRef);
const opacity = computed(() => (isVisible.value ? 1 : 0));

</script>

<template>
    <figure ref="figureRef" class="flex items-center">
        <NuxtImg
            :src="src"
            :alt="alt"
            class="w-full h-auto object-cover transition-opacity duration-1000"
            :style="{ opacity: opacity, transitionDelay: `${delay ? (delay * 150) : 0}ms` }"
        />
    </figure>
</template>