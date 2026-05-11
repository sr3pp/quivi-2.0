<script setup lang="ts">
const {data: mainBrandsData} = await useAsyncData("main-brands", () => queryCollection("configMainBrands").first());
const brands = computed(() => mainBrandsData.value?.brands || [])
</script>

<template>
    <UContainer class="py-10">
        <h2 class="text-4xl font-bold mb-8 mr-auto">
            <slot name="title" mdc-unwrap="p"></slot>
        </h2>
        <UPageGrid>
            <UPageGrid class="col-span-12 sm:col-span-6 md:col-span-7 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
                <FadeImg v-for="(brand, index) in brands" :key="brand.name + '-fade'" :src="brand.logo.src" :alt="brand.logo.alt" :delay="index + 1" />
            </UPageGrid>
            <figure class="sm:-mt-10 col-span-12 sm:col-span-6 md:col-span-5">
                <NuxtImg src="/img/camion.png" alt="Imagen de marcas" class="w-full h-auto object-cover sm:-mt-30" />
            </figure>
        </UPageGrid>
    </UContainer>
</template>