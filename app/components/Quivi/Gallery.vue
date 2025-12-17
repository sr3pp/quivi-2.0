<script lang="ts" setup>
defineProps({
  gallery: {
    type: Array,
    required: true,
  },
});

const galleryModal = ref(null);

defineExpose({
  refEl: galleryModal,
});
</script>

<template lang="pug">
SrModal(ref="galleryModal")
  template(#body)
    SrGrid
      SrGridColumn(:size="{mobile: '1', sm: '1/3', md: '1/5'}" v-for="(thumb, i) in gallery" :key="i")
        button(@click="$emit('setPicture', 'https://via.placeholder.com/1100x322')") test picture
      SrGridColumn(:size="{mobile: '1', sm: '1/3', md: '1/5'}" v-for="(thumb, i) in gallery" :key="i")
        SrPicture(:src="thumb.url" :alt="thumb.name")

</template>

<style scoped></style>
