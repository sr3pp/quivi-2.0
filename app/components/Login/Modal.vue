<script lang="ts" setup>
const modalSw = ref(false);

const toggleLoginModal = () => {
  modalSw.value = !modalSw.value;
};

defineExpose({
  toggleLoginModal,
});
</script>

<template lang="pug">
UModal(v-model:open="modalSw")
    template(#header)
      p.font-bebas.text-3xl Login
    template(#body)
      LoginForm

</template>
