<script setup lang="ts">
type WelcomeImages = {
  primary?: string;
  secondary?: string;
};

defineProps<{
  title: String;
  images: WelcomeImages;
}>();
</script>

<template>
  <section>
    <UContainer class="py-10">
      <div class="grid grid-cols-[12]">
        <h3 class="text-xl font-bebas text-gray-700 mb-8 col-span-12">
          {{ title }}
        </h3>
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
