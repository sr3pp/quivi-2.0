<script setup lang="ts">
defineProps<{
    cols?: number;
}>()
</script>

<template>
    <UContainer class="py-10">
        <UPageGrid :class="`grid-cols-1 sm:grid-cols-${cols ?? 2} md:grid-cols-${cols ?? 2} lg:grid-cols-${cols ?? 2} gap-8`">
            <slot />
        </UPageGrid>
    </UContainer>
</template>