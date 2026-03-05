<template lang="pug">
UForm(:state="formState" :schema="schema" @submit="onSubmit" class="space-y-4")
  UFormField(label="E-mail" name="email" required)
    UInput.w-full(v-model="formState.email" type="email" placeholder="correo@dominio.com")

  UFormField(v-if="showPassword" label="Password" name="password" required)
    UInput.w-full(v-model="formState.password" type="password")

  UFormField(v-if="showPassword" label="Password Confirm" name="password_confirmation" required)
    UInput.w-full(v-model="formState.password_confirmation" type="password")

  UFormField(label="Admin Level" name="admin_level" required)
    USelect.w-full(v-model="formState.admin_level" :items="adminOptions")

  UFormField(label="Nombre" name="profile.name" required)
    UInput.w-full(v-model="formState.profile.name")

  UFormField(label="Apellido" name="profile.lastname" required)
    UInput.w-full(v-model="formState.profile.lastname")

  UFormField(label="Tel:" name="profile.phone" required)
    UInput.w-full(v-model="formState.profile.phone" type="tel")

  UFormField(label="RFC" name="profile.rfc")
    UInput.w-full(v-model="formState.profile.rfc")

  .flex.justify-end.gap-2
    slot(name="actions")
      UButton(type="submit" :label="submitLabel")
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { User } from "~/types";

const props = withDefaults(
  defineProps<{ user?: User | null; mode?: "create" | "edit" }>(),
  {
    user: null,
    mode: "create",
  },
);

const showPassword = computed(() => props.mode === "create");
const submitLabel = computed(() =>
  props.mode === "create" ? "Crear" : "Actualizar",
);

const adminOptions = [
  { label: "Usuario", value: 0 },
  { label: "Editor", value: 1 },
  { label: "Administrador", value: 3 },
];

const baseSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  admin_level: z.coerce.number().int(),
  profile: z.object({
    name: z.string().min(1, "El nombre es requerido").trim(),
    lastname: z.string().min(1, "El apellido es requerido").trim(),
    phone: z.string().min(1, "El teléfono es requerido").trim(),
    rfc: z.string().trim().optional(),
  }),
});

const createSchema = baseSchema
  .extend({
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

const emit = defineEmits<{
  (
    e: "submit",
    data: z.output<typeof createSchema> | z.output<typeof baseSchema>,
  ): void;
}>();

const schema = computed(() => (showPassword.value ? createSchema : baseSchema));

const formState = reactive({
  email: "",
  admin_level: 0,
  password: "",
  password_confirmation: "",
  profile: {
    name: "",
    lastname: "",
    phone: "",
    rfc: "",
  },
});

const resetForm = () => {
  formState.email = "";
  formState.admin_level = 0;
  formState.password = "";
  formState.password_confirmation = "";
  formState.profile.name = "";
  formState.profile.lastname = "";
  formState.profile.phone = "";
  formState.profile.rfc = "";
};

watch(
  () => props.user,
  (user) => {
    if (!user) {
      resetForm();
      return;
    }

    formState.email = user.email ?? "";
    formState.admin_level = user.admin_level ?? 0;
    formState.password = "";
    formState.password_confirmation = "";
    formState.profile.name = user.profile?.name ?? "";
    formState.profile.lastname = user.profile?.lastname ?? "";
    formState.profile.phone = user.profile?.phone ?? "";
    formState.profile.rfc = (user as any).profile?.rfc ?? "";
  },
  { immediate: true },
);

const onSubmit = (
  event: FormSubmitEvent<
    z.output<typeof createSchema> | z.output<typeof baseSchema>
  >,
) => {
  emit("submit", event.data);
};
</script>
