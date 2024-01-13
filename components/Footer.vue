<template lang="pug">
footer.quivi-footer
    SrContainer
        SrGrid
            SrGridColumn(:size="{mobile: '1', sm: '1/5'}" class="column")
                SrText(text="NAVEGACIÓN" class="subtitle")
                ul.quivi-footer-menu
                    li.quivi-footer-menu-item(v-for="(item, i) in footer.navegacion" :key="i")
                        NuxtLink(:to="item.url" :aria-label="item.label" :title="item.label") {{ item.label }}
                ul.quivi-footer-social
                    li.quivi-footer-social-item(v-for="(item, i) in footer.social" :key="i")
                        a(:href="item.url" target="_blank" :aria-label="item.label" :title="item.label")
                            SrIcon(:name="item.icon")
            SrGridColumn(:size="{mobile: '1', sm: '1/5'}" class="column")
                SrText(value="Cliente" class="subtitle")
                ul.quivi-footer-menu
                    li.quivi-footer-menu-item
                        button(@click="cartSwitch = true") Carrito
                    li.quivi-footer-menu-item
                        NuxtLink(to="/") Tienda
                    li.quivi-footer-menu-item
                        button(@click="loginSw = true") Registro
            SrGridColumn(:size="{mobile: '1', sm: '3/5'}" class="column")
                SrText(text="Distribuidor Autorizado" class="subtitle")
    SrGrid.quivi-footer-bottom
        SrGridColumn(:size="{mobile: '1', sm: '1/3'}" class="column")
            SrText(text="© 2021 Quivi" alignment="center")
        SrGridColumn(:size="{mobile: '1', sm: '1/3'}" class="column")
            SrText(text="© 2021 Quivi" alignment="center")
        SrGridColumn(:size="{mobile: '1', sm: '1/3'}" class="column")
            SrText(text="© 2021 Quivi" alignment="center")
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
  social: [
    {
      label: "Youtube",
      url: "/",
      icon: "youtube-f",
    },
    {
      label: "Facebook",
      url: "/",
      icon: "facebook-f",
    },
    {
      label: "Instagram",
      url: "/",
      icon: "instagram-f",
    },
    {
      label: "Linkedin",
      url: "/",
      icon: "linkedin-f",
    },
    {
      label: "Whatsapp",
      url: "/",
      icon: "whatsapp-o",
    },
  ],
};

const cartSwitch = useState("cartSwitch", () => false);
const loginSw = useState("loginSw", () => false);
</script>

<style lang="scss" scoped>
.quivi-footer {
  overflow: hidden;
  &-social,
  &-menu {
    display: flex;
    flex-direction: column;

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

  .sr-container {
    padding-top: pxToRem(20);
    padding-bottom: pxToRem(20);
  }

  &-social {
    flex-direction: row;
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

  &-bottom {
    background-color: $color-quivi-red;
    color: $color-text-color;
  }
}
</style>
