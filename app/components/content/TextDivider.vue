<script setup lang="ts">
defineProps<{
    title: String;
  text?: String;
}>();
</script>

<template>
<section>
    <UContainer class="grid grid-cols-12 gap-4 py-10">
        <article class="col-span-1 sm:col-span-2 md:col-span-3">
            <h2 class="text-center text-2xl sm:text-5xl">
                {{ title }}
            </h2>
        </article>
        <article class="col-span-1 sm:col-span-2 md:col-span-9 sm:border-l border-gray-300 sm:pl-6 flex flex-col">
            <p class="text-gray-600 my-auto">
                {{ text }}
            </p>
        </article>
    </UContainer>
</section>
</template>