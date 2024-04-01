<template lang="pug">
.login 
    SrText(text="Login" class="title")
    SrForm.login-form(:fieldsets="loginForm" @submit="login" submit="hidden")
        template(#submit)
            QuiviButton(type="submit" label="Enviar" variant="secondary")
</template>

<script lang="ts" setup>
const loginForm = ref([
  {
    fields: [
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
          label: "Password",
          value: "",
          name: "password",
          type: "password",
          required: true,
        },
      },
    ],
  },
]);

const login = async (data: any) => {
  try {
    await useFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss">
.login {
  &-form {
    fieldset {
      margin-bottom: 1rem;
      border: none;
    }
  }
}
</style>
