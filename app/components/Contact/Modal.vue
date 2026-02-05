<script lang="ts" setup>
defineProps({
  social: {
    type: Array,
    default: () => [],
  },
});

const modalSw = ref(false);

const toggleContactModal = () => {
  modalSw.value = !modalSw.value;
};

defineExpose({
  toggleContactModal,
});
</script>

<template lang="pug">
UModal(v-model:open="modalSw" :ui="{ content: 'max-w-2xl' }")
    template(#content)
      UPageGrid
        div(class="col-span-1 sm:col-span-6 py-4 pl-4 flex flex-col gap-6")
          p.font-bebas.text-3xl Contacto
          ContactForm
            NuxtLink.text-primary.flex.items-center.gap-2(to="tel:5574763104")
              SvgIcon.size-6(name="whatsapp-o")
              p 55 7476 3104
          ul.flex.justify-between.gap-2.mt-auto
            li.flex.gap-2.text-primary(v-for="(item, i) in social" :key="i")
              NuxtLink(:href="item.url" target="_blank" :aria-label="item.label")
                SvgIcon.size-6(:name="item.icon")
        div(class="col-span-1 sm:col-span-6")
          NuxtImg.h-full.object-cover(src="/img/contacto.jpg" alt="Assesor trabajando")
</template>
