<template lang="pug">
.contact-form
    SrForm(v-if="!sent" :fieldsets="contactForm" @submit="sendContactForm" submit="hidden")
      template(#submit)
        QuiviButton(type="submit" label="Enviar" variant="secondary" :disabled="sending")
    .success(v-else)
      SrText(text="¡Mensaje enviado con éxito!" class="subtitle" alignment="center")
</template>

<script lang="ts" setup>
const content = await $fetch("/api/content?page=_config/contact");
const contactEmail = content.email;

const sending: Ref<boolean> = ref(false);
const sent = ref<boolean>(false);

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
  sending.value = true;
  const data = {
    context: contact,
    template: "contact",
    to: contactEmail,
    subject: "Mensaje de formulario de contacto",
  };

  try {
    await $fetch("/api/send-mail", {
      method: "POST",
      body: data,
    });
    sent.value = true;
  } catch (error) {
    console.error("Error sending contact form:", error);
    sent.value = false;
  }

  sending.value = false;
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

  .success {
    min-height: pxToRem(200);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
