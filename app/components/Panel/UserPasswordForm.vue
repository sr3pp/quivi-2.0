<template lang="pug">
UForm(:state="formState" :schema="schema" @submit="onSubmit" class="space-y-4")
  UFormField(label="Password" name="password" required)
    UInput.w-full(v-model="formState.password" type="password")

  UFormField(label="Confirm password" name="password_confirmation" required)
    UInput.w-full(v-model="formState.password_confirmation" type="password")

  .flex.justify-end.gap-2
    slot(name="actions")
      UButton(type="submit" label="Guardar")
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<{
  (e: "submit", data: z.output<typeof schema>): void;
}>();

const schema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    password_confirmation: z
      .string()
      .min(6, "La confirmación debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Las contraseñas no coinciden",
  });

const formState = reactive({
  password: "",
  password_confirmation: "",
});

const resetForm = () => {
  formState.password = "";
  formState.password_confirmation = "";
};

const onSubmit = (event: FormSubmitEvent<z.output<typeof schema>>) => {
  emit("submit", event.data);
  resetForm();
};
</script>
