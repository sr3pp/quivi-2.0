<script setup lang="ts">
// No props needed - using slots
</script>

<template>
  <section>
    <UContainer class="grid grid-cols-12 py-8 sm:py-10 gap-8">
      <slot />
    </UContainer>
  </section>
</template>
