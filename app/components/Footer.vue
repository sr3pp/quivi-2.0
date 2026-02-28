<template lang="pug">
footer(
  class="bg-[url('/img/svg/footer_bg.svg')] bg-no-repeat bg-center bg-cover overflow-hidden"
)
    UContainer(class="py-10")
        UPageGrid.gap-2
            div(class="flex flex-col col-span-12 sm:col-span-2 gap-4")
                p(class="text-black") Navegación
                ul(class="flex flex-col gap-2.5 mb-5")
                    li(
                      class="p-0.5 text-[var(--color-quivi-light-red)]"
                      v-for="(item, i) in footer.navegacion"
                      :key="i"
                    )
                        NuxtLink(class="text-current" :to="item.url" :aria-label="item.label" :title="item.label") {{ item.label }}
            div(class="flex flex-col col-span-12 sm:col-span-2 gap-4")
                p(class="text-black") Cliente
                ul(class="flex flex-col gap-2.5 mb-5")
                    li(class="p-0.5 text-[var(--color-quivi-light-red)]")
                        button(class="bg-transparent border-0 text-current text-inherit p-0" @click="toggleCart") Carrito
                    li(class="p-0.5 text-[var(--color-quivi-light-red)]")
                        NuxtLink(class="text-current" to="/tienda") Tienda
                    li(class="p-0.5 text-[var(--color-quivi-light-red)]")
                        button(class="bg-transparent border-0 text-current text-inherit p-0" @click="$emit('loginModal')") Registro
            div(class="flex flex-col col-span-12 sm:col-span-8 gap-4")
                p(class="text-black") Distribuidor Autorizado
                ul(class="flex flex-wrap justify-center")
                    li(
                      class="flex items-center w-1/3"
                      v-for="(item, i) in distribuidores"
                      :key="i"
                    )
                      NuxtImg(class="max-w-[100px]" :src="item.logo" :alt="item.name")
            div(class="flex flex-col col-span-12 gap-4")
              ul(class="flex flex-row gap-2.5")
                  li(
                    class="text-[var(--color-quivi-red)] flex items-end p-0.5"
                    v-for="(item, i) in social"
                    :key="i"
                  )
                      NuxtLink(class="text-current" :to="item.url" target="_blank" :aria-label="item.label" :title="item.label")
                          SvgIcon(class="size-20 flex" :name="item.icon")
    UPageGrid(class="bg-[var(--color-quivi-red)] py-1")
        div(class="flex flex-col col-span-12 sm:col-span-1/3 md:col-span-4 justify-center items-center")
          NuxtLink(to="/")
            p(class="text-[var(--color-text-color)] font-bebas text-2xl text-center") Quivi.mx
        div(class="flex flex-col col-span-12 sm:col-span-1/3 md:col-span-4 justify-center items-center")
          NuxtLink(to="/pdf/aviso_de_privacidad.pdf" target="_blank")
            p(class="text-[var(--color-text-color)] font-bebas text-2xl text-center") Aviso de privacidad
        div(class="flex flex-col col-span-12 sm:col-span-1/3 md:col-span-4 justify-center items-center")
          button(class="bg-transparent border-0 text-[var(--color-white)] text-inherit p-0" @click="$emit('termsModal')")
            p(class="text-[var(--color-text-color)] font-bebas text-2xl text-center") Términos y Condiciones
</template>

<script lang="ts" setup>
const { toggleCart } = useCart();

const footer = {
  navegacion: [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Catálogo",
      url: "/catalogo",
    },
    {
      label: "Nosotros",
      url: "/nosotros",
    },
  ],
};

defineProps({
  social: {
    type: Array,
    default: () => [],
  }
});

const { data: distribuidoresPage } = await useAsyncData("config-distribuidores", () => queryCollection("configDistribuidores").first());

const distribuidores = computed(() => {
  return distribuidoresPage.value?.distribuidores ?? [];
});
</script>
