<template lang="pug">
SrContainer.panel(:with-padding="true")
  ul
    li(v-for="(item, i) in items" :key="i")
      NuxtLink(:to="item.to") {{ item.label }}
  button(@click="testMail") Test Mail
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const items = [
  {
    label: "Users",
    to: "/panel/users",
  },
  {
    label: "Ventas",
    to: "/panel/sales",
  },
  {
    label: "Envios",
    to: "/panel/shipping",
  },
  {
    label: "Contenido",
    to: "/panel/content",
  },
];

const { public: conf } = useRuntimeConfig();

const testMail = async () => {
  try {
    await $fetch("/api/send-mail", {
      method: "POST",
      body: {
        to: (conf.email as any).testMail,
        subject: "Test",
        template: "test",
        context: {
          name: "Juan",
          description: "Test email",
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.panel {
}
</style>
