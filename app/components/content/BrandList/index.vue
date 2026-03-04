<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section>
    <UContainer class="py-10">
      <h2 class="text-black text-4xl mb-8">
        {{ title }}
      </h2>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center justify-center"
      >
        <slot name="items" />
      </div>
    </UContainer>
  </section>
</template>
