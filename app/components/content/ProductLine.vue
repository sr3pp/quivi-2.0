<script setup lang="ts">
defineProps<{
    title: string;
}>();
const {data: sliderPage} = await useAsyncData("product-line-slides", () => queryCollection("sliders").where("stem", "LIKE", "sliders/linea-productos").first());
const slides = computed(() => sliderPage.value?.slides || []);

</script>

<template>
    <section
        class="product-line-gradient py-10 relative w-full"
    >
        <UContainer class="pb-10">
            <h2 v-if="title" class="text-4xl font-bold text-center">{{ title }}</h2>
        </UContainer>
        <UCarousel
            :arrows="true"
            :dots="true"
            :loop="true"
            :items="slides"
            :ui="{
                item: 'basis-full sm:basis-1/3 lg:basis-1/4 ps-20',
                container: 'flex-row -ms-20',
                viewport: 'px-20 py-10',
                prev: 'sm:start-8',
                next: 'sm:end-8'
            }"
        >
            <template #default="{ item: slide }">
                <NuxtLink :to="slide.cta?.to" class="w-full flex flex-col gap-4 relative square-holder">
                    <h3 class="font-bebas text-3xl text-secondary text-right relative z-10 p-6">{{ slide.title }}</h3>
                    <NuxtImg :src="slide.image.src.sm" :alt="slide.image.alt" class="h-auto object-cover ml-8 my-4 relative z-10 w-4/5 mr-auto" />
                </NuxtLink :to="slide.cta?.to">
            </template>
        </UCarousel>
    </section>
</template>

<style scoped>
.product-line-gradient {
    background-color: var(--color-quivi-light-gray);
    background-image: radial-gradient(
        circle at center,
        var(--color-white) 0%,
        var(--color-white) 40%,
        var(--color-quivi-light-gray) 100%
    );
    background-repeat: no-repeat;
}

.square-holder::before {
    content: "";
    display: block;
    position: absolute;
    width: 80%;
    height: 100%;
    top: 42%;
    left: 65%;
    transform: translate(-50%, -50%);
    transform-origin: center;
    border-style: solid;
    border-width: .25rem;
    border-color: var(--color-quivi-dark-gray);
    rotate: -10deg;
    transform-origin: center;
}

.square-holder::after{
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("/img/textura.jpg");
    background-position: center right;
    background-repeat: no-repeat;
    background-size: contain;
}
</style>
