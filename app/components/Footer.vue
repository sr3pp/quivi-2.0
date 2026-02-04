<template lang="pug">
footer.quivi-footer
    UContainer(class="py-10")
        UPageGrid.gap-2
            div(class="flex flex-col col-span-12 sm:col-span-2 gap-4")
                p(class="text-black") Navegación
                ul.quivi-footer-menu
                    li.quivi-footer-menu-item(v-for="(item, i) in footer.navegacion" :key="i")
                        NuxtLink(:to="item.url" :aria-label="item.label" :title="item.label") {{ item.label }}
            div(class="flex flex-col col-span-12 sm:col-span-2 gap-4")
                p(class="text-black") Cliente
                ul.quivi-footer-menu
                    li.quivi-footer-menu-item
                        button(@click="toggleCart") Carrito
                    li.quivi-footer-menu-item
                        NuxtLink(to="/tienda") Tienda
                    li.quivi-footer-menu-item
                        button(@click="$emit('loginModal')") Registro
            div(class="flex flex-col col-span-12 sm:col-span-8 gap-4")
                p(class="text-black") Distribuidor Autorizado
                ul.quivi-footer-distribuidores
                    li.quivi-footer-distribuidores-item(v-for="(item, i) in distribuidores" :key="i")
                      NuxtImg(:src="item.logo" :alt="item.name")
            div(class="flex flex-col col-span-12 gap-4")
              ul.quivi-footer-social
                  li.quivi-footer-social-item(v-for="(item, i) in social" :key="i")
                      a(:href="item.url" target="_blank" :aria-label="item.label" :title="item.label")
                          SvgIcon(:name="item.icon")
    UPageGrid.quivi-footer-bottom
        div(class="flex flex-col col-span-12 sm:col-span-1/3 md:col-span-4 justify-center items-center")
          NuxtLink(to="/")
            p Quivi.mx
        div(class="flex flex-col col-span-12 sm:col-span-1/3 md:col-span-4 justify-center items-center")
          NuxtLink(to="/pdf/aviso_de_privacidad.pdf" target="_blank")
            p Aviso de privacidad
        div(class="flex flex-col col-span-12 sm:col-span-1/3 md:col-span-4 justify-center items-center")
          button(@click="$emit('termsModal')")
            p Términos y Condiciones
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
  },
  distribuidores: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.quivi-footer {
  background: url("/img/svg/footer_bg.svg") no-repeat center center;
  background-size: cover;
  overflow: hidden;

  .sr-text {
    &.subtitle {
      margin-bottom: pxToRem(10);
    }
  }

  &-social,
  &-menu {
    display: flex;
    flex-direction: column;
    gap: pxToRem(10);

    &-item {
      padding: pxToRem(2);
      color: $color-quivi-light-red;

      a {
        color: currentColor;
      }

      button {
        background: none;
        border: none;
        color: currentColor;
        font-size: inherit;
        padding: 0;
      }
    }
  }
  &-menu {
    margin-bottom: pxToRem(20);
  }
  &-social {
    flex-direction: row;
    gap: pxToRem(10);
    &-item {
      color: $color-quivi-red;
      display: flex;
      align-items: flex-end;
      a {
        .sr-icon {
          width: pxToRem(30);
          height: pxToRem(30);
        }
      }
    }
  }

  &-distribuidores {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &-item {
      display: flex;
      align-items: center;
      width: 33.33%;
      img {
        max-width: pxToRem(100);
      }
    }
  }

  &-bottom {
    background-color: $color-quivi-red;
    padding-top: pxToRem(4);
    padding-bottom: pxToRem(4);
    button {
      background: none;
      border: none;
      color: $color-white;
      font-size: inherit;
      padding: 0;
    }
    .sr-text {
      color: $color-text-color;
      font-family: bebas;
      font-size: pxToRem(24);
      --text-align: center;
    }
  }
}
</style>
