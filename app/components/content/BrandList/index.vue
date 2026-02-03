<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section>
    <UContainer>
      <h2 class="text-black">
        {{ title }}
      </h2>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center"
      >
        <slot name="items" />
      </div>
    </UContainer>
  </section>
</template>
