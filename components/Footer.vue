<template lang="pug">
footer.quivi-footer
    SrContainer(:with-padding="true")
        SrGrid
            SrGridColumn(:size="{mobile: '1', sm: '1/5'}" class="column")
                SrText(text="NAVEGACIÓN" class="subtitle")
                ul.quivi-footer-menu
                    li.quivi-footer-menu-item(v-for="(item, i) in footer.navegacion" :key="i")
                        NuxtLink(:to="item.url" :aria-label="item.label" :title="item.label") {{ item.label }}
                ul.quivi-footer-social
                    li.quivi-footer-social-item(v-for="(item, i) in social" :key="i")
                        a(:href="item.url" target="_blank" :aria-label="item.label" :title="item.label")
                            SrIcon(:name="item.icon")
            SrGridColumn(:size="{mobile: '1', sm: '1/5'}" class="column")
                SrText(text="Cliente" class="subtitle")
                ul.quivi-footer-menu
                    li.quivi-footer-menu-item
                        button(@click="$emit('cartModal')") Carrito
                    li.quivi-footer-menu-item
                        NuxtLink(to="/") Tienda
                    li.quivi-footer-menu-item
                        button(@click="$emit('loginModal')") Registro
            SrGridColumn(:size="{mobile: '1', sm: '3/5'}" class="column")
                SrText(text="Distribuidor Autorizado" class="subtitle")
                ul.quivi-footer-distribuidores
                    li.quivi-footer-distribuidores-item(v-for="(item, i) in distribuidores" :key="i")
                      SrPicture(:src="item.logo" :alt="item.nombre")
    SrGrid.quivi-footer-bottom
        SrGridColumn(:size="{mobile: '1', sm: '1/3'}" class="column")
          NuxtLink(to="/")
            SrText(text="Quivi.mx")
        SrGridColumn(:size="{mobile: '1', sm: '1/3'}" class="column")
          NuxtLink(to="/pdf/aviso_de_privacidad.pdf" target="_blank")
            SrText(text="Aviso de privacidad")
        SrGridColumn(:size="{mobile: '1', sm: '1/3'}" class="column")
          button(@click="console.log('ir terminos y condiciones')")
            SrText(text="Términos y Condiciones")
</template>

<script lang="ts" setup>
const footer = {
  navegacion: [
    {
      label: "Tienda",
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
      .sr-picture {
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
