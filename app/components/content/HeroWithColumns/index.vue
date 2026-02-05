<script setup lang="ts">
defineProps<{
    image: {
        src: string;
        alt?: string;
    }

}>()
</script>

<template>
<section class="bg-gray-300">
    <NuxtImg class="w-full" :src="image.src" :alt="image.alt" />
    <UContainer>
        <UPageGrid class="pb-12">
            <slot />
        </UPageGrid>
    </UContainer>
</section>
</template>