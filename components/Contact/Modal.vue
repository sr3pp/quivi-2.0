<script lang="ts" setup>
defineProps({
  social: {
    type: Array,
    default: () => [],
  },
});

const contactModal = ref(null);

const toggleContactModal = () => {
  (contactModal.value as any).toggle();
};

defineExpose({
  toggleContactModal,
});
</script>

<template lang="pug">
SrModal.modal-contact-form(ref="contactModal")
    template(#body)
        SrGrid
          SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
            SrText(text="Contacto" class="title")
            ContactForm
            NuxtLink.modal-contact-form-whats(to="tel:5574763104" class="quivi-button")
              SrIcon(name="whatsapp-o")
              SrText(text="55 7476 3104")
            ul.modal-contact-form-social
              li.modal-contact-form-social-item(v-for="(item, i) in social" :key="i")
                NuxtLink(:href="item.url" target="_blank" :aria-label="item.label")
                  SrIcon(:name="item.icon")
          SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
            SrPicture(src="/img/contacto.jpg" alt="Assesor trabajando")
</template>

<style lang="scss">
.modal-contact-form {
  .sr-modal-content {
    max-width: pxToRem(800);
    min-width: inherit !important;
  }
  .sr-modal-close {
    z-index: 3;
  }
  .sr-modal-body {
    padding: 0 !important;
    max-height: inherit !important;
    overflow: hidden !important;
    border-radius: pxToRem(10);

    .sr-picture {
      height: 100%;
      display: flex;
      img {
        height: 100%;
      }
    }
  }
  .sr-grid {
    margin: 0;
    [class*="sr-grid-col"] {
      padding: 0 !important;
      justify-content: center;

      &:first-child {
        padding: pxToRem(20) !important;
      }
    }
  }
  &-whats {
    display: flex;
    align-items: center;
    margin-top: pxToRem(-40);
    margin-bottom: pxToRem(40);
    color: $color-quivi-red;
    width: 50%;
    .sr-icon {
      width: pxToRem(30);
      height: pxToRem(30);
      margin-right: pxToRem(10);
    }
  }
  &-social {
    display: flex;
    justify-content: space-between;
    gap: pxToRem(10);
    padding: pxToRem(10);

    .sr-icon {
      width: pxToRem(30);
      height: pxToRem(30);
      color: $color-quivi-red;
    }
  }

  .contact-form {
    .quivi-button {
      width: 50%;
    }
  }
}
</style>
