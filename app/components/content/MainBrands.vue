<script setup lang="ts">
defineProps<{
    title: {
        text: string;
        highlight: string;
    };
}>();

const {data: mainBrandsData} = await useAsyncData("main-brands", () => queryCollection("configMainBrands").first());
const brands = computed(() => mainBrandsData.value?.brands || [])
</script>

<template>
    <UContainer class="py-10">
        <h2 class="text-4xl font-bold mb-8 mr-auto">
            {{ title.text }}
            <span class="text-primary">
                {{ title.highlight }}
            </span>
        </h2>
        <UPageGrid>
            <UPageGrid class="col-span-12 sm:col-span-6 md:col-span-7 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
                <figure v-for="brand in brands" :key="brand.name" class="flex items-center">
                    <NuxtImg :src="brand.logo.src" :alt="brand.logo.alt" class="w-full h-auto object-cover" />
                </figure>
            </UPageGrid>
            <figure class="sm:-mt-10 col-span-12 sm:col-span-6 md:col-span-5">
                <NuxtImg src="/img/camion.png" alt="Imagen de marcas" class="w-full h-auto object-cover sm:-mt-30" />
            </figure>
        </UPageGrid>
    </UContainer>
</template>