<script setup lang="ts">
type WelcomeImages = {
  primary?: string;
  secondary?: string;
};

defineProps<{
  title: String;
  subtitle: String;
  images: WelcomeImages;
}>();
</script>

<template>
  <section>
    <UContainer class="py-20 text-center">
      <h2 class="font-bold text-4xl mb-6">{{ title }}</h2>
      <div class="grid grid-cols-[12]">
        <p class="text-lg text-gray-700 mb-8 col-span-12">
          {{ subtitle }}
        </p>
        <figure class="col-span-8">
          <img :src="images!.primary" alt="Welcome Image 1" />
        </figure>
        <figure class="col-span-4">
          <img :src="images!.secondary" alt="Welcome Image 2" />
        </figure>
      </div>
    </UContainer>
  </section>
</template>
