<template lang="pug">
  UForm(:state="formState" :schema="schema" @submit="login" class="space-y-4")
      UFormField(label="Correo Electrónico" name="email" required)
          UInput.w-full(v-model="formState.email" type="email" placeholder="Ingresa tu correo")
      
      UFormField(label="Contraseña" name="password" required)
          UInput.w-full(v-model="formState.password" type="password" placeholder="Ingresa tu contraseña")
      
      UButton(type="submit" label="Iniciar Sesión")
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

// Zod validation schema
const schema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type Schema = z.output<typeof schema>;

// Form state
const formState = reactive({
  email: "",
  password: "",
});

const login = async (event: FormSubmitEvent<Schema>) => {
  try {
    await useAuth().login(event.data.email, event.data.password);
  } catch (error) {
    console.error(error);
  }
};
</script>
