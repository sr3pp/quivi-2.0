<template lang="pug">
    UForm.flex.flex-col(v-if="!sent" :state="formState" :schema="schema" @submit="sendContactForm" class="space-y-4")
      UFormField(label="Nombre" name="name" required)
        UInput.w-full(v-model="formState.name" placeholder="Ingresa tu nombre")
      
      UFormField(label="Teléfono" name="tel")
        UInput.w-full(v-model="formState.tel" type="tel" placeholder="Ingresa tu teléfono")
      
      UFormField(label="Whatsapp" name="whatsapp")
        UInput.w-full(v-model="formState.whatsapp" type="tel" placeholder="Ingresa tu Whatsapp")
      
      UFormField(label="Correo Electronico" name="email" required)
        UInput.w-full(v-model="formState.email" type="email" placeholder="Ingresa tu correo")
      
      UFormField(label="Mensaje" name="message" required)
        UTextarea.w-full(v-model="formState.message" placeholder="Escribe tu mensaje" :rows="5")
      
      .flex.justify-between.items-center
        slot
        UButton(type="submit" label="Enviar" :disabled="sending" :loading="sending")
    
    .success(v-else)
      p ¡Mensaje enviado con éxito!
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const content = await $fetch("/api/content?page=_config/contact");
const contactEmail = content.email;

const sending = ref(false);
const sent = ref(false);

// Zod validation schema
const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").trim(),
  tel: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  message: z.string().min(1, "El mensaje es requerido").trim(),
});

// Form state
const formState = reactive({
  name: "",
  tel: "",
  whatsapp: "",
  email: "",
  message: "",
});

const sendContactForm = async (
  event: FormSubmitEvent<z.output<typeof schema>>,
) => {
  sending.value = true;
  const data = {
    context: event.data,
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