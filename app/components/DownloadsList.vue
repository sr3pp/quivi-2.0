<template lang="pug">
div
    p.font-bold.text-3xl Descargas
    ul(class="flex w-full flex-wrap")
        li(
          class="flex flex-col max-w-1/4 w-full shrink-0 p-5 border-r-2 border-[var(--color-quivi-light-red)] last:border-r-0"
          v-for="(item, i) in downloads"
          :key="`downloads-${item.label}-${i}`"
        )
            p.text-2xl.capitalize(class="mb-2.5") {{ item.label }}
            ol
                li(v-for="(subItem, j) in item.items" :key="`downloads-${item.label}-${j}`")
                    a.text-primary(class="break-all" :href="subItem.url" target="_blank") {{ subItem.label }}
</template>

<script lang="ts" setup>
const props = defineProps({
  path: {
    type: String,
    default: "",
  },
});

const { data: downloads } = await useAsyncData(`downloads-${props.path}`, () => queryCollection('downloads').where('stem', 'LIKE', `downloads/${props.path}%`).all());

</script>

<style scoped></style>
