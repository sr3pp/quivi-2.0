<template lang="pug">
.contact-form
    SrForm(:fieldsets="contactForm" @submit="sendContactForm" submit="hidden")
      template(#submit)
        QuiviButton(type="submit" label="Enviar" variant="secondary")
</template>

<script lang="ts" setup>
const contactForm: any = ref([
  {
    fields: [
      {
        component: "SrFormInput",
        props: {
          label: "Nombre",
          value: "",
          name: "name",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Correo Electronico",
          value: "",
          name: "email",
          type: "email",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          label: "Mensaje",
          value: "",
          name: "message",
          type: "textarea",
          required: true,
        },
      },
    ],
  },
]);
const sendContactForm = async (contact: any) => {
  const data = {
    context: contact,
    template: "contact",
    to: "asistente@quivi.mx",
    subject: "Mensaje de formulario de contacto",
  };

  await $fetch("/api/send-mail", {
    method: "POST",
    body: data,
  });
};
</script>

<style lang="scss">
.contact-form {
  .sr-form {
    padding: 0;
    width: 100%;
    fieldset {
      padding: 0;
      border: none;
      outline: none;
      gap: 0 !important;
      .sr-form-input {
        margin-bottom: pxToRem(20);
      }
    }

    .quivi-button {
      margin-right: 0;
    }
  }
}
</style>
