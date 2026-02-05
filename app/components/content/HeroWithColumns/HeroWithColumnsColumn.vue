<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
}>();
</script>

<template>
  <article class="col-span-1 sm:col-span-4 flex flex-col px-4">
    <SvgIcon
      :name="icon || 'Q-o'"
      class="size-20 -mt-10 bg-gray-300 flex items-center justify-center rounded-t-md text-primary p-4 mx-auto"
    />
    <p class="text-center text-lg font-bebas w-full mb-4">
      {{ title }}
    </p>
    <slot class="w-full m-0" />
  </article>
</template>
