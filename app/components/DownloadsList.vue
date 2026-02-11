<template lang="pug">
div
    p Descargas
    ul(class="flex w-full flex-wrap")
        li(
          class="flex flex-col max-w-1/4 w-full shrink-0 p-5 border-r-2 border-[var(--color-quivi-light-red)] last:border-r-0"
          v-for="([key, value], i) in Object.entries(downloads)"
          :key="i"
        )
            p(class="mb-2.5")= key
            ol
                li(v-for="(item, i) in value" :key="i")
                    a(class="break-all" :href="`/downloads${path}/${key}/${item}`" target="_blank")= item
</template>

<script lang="ts" setup>
defineProps({
  downloads: {
    type: Object,
    default: () => ({}),
  },
  path: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
