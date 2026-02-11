<script lang="ts" setup>
defineProps<{
  backgroundImage: string;
  mainImage: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  cta?: {
    text: string;
    link: string;
  };
}>();
</script>

<template>
  <section
    class="bg-cover bg-center"
    :style="{ 'background-image': `url('${backgroundImage}')` }"
  >
    <UContainer class="grid grid-cols-1 gap-10 py-10">
      <div class="flex items-center justify-center w-full">
        <img :src="mainImage.src" :alt="mainImage.alt" />
      </div>
      <div class="flex flex-col items-center justify-center text-center">
        <h2 class="text-4xl font-bold mb-4">{{ title }}</h2>
        <p class="mb-6">{{ description }}</p>
        <div v-if="cta" class="flex justify-center items-center">
          <UButton color="secondary" :to="cta.link">
            {{ cta.text }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
