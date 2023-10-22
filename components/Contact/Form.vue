<template lang="pug">
.contact-form
    SrForm(:form="contactForm" @submit="sendContactForm")
</template>

<script lang="ts" setup>
const contactForm: any = {
  name: "",
  email: "",
  message: "",
};

const sendContactForm = (data: any) => {
  console.log(data);
};
</script>

<style lang="scss" scoped></style>
