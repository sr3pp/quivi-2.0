<template lang="pug">
.login 
    SrForm(:form="loginForm" @submit="login")
</template>

<script lang="ts" setup>
const loginForm: any = {
  email: "",
  password: "",
};

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
