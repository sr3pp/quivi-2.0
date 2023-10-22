<template lang="pug">
.seo-wizzard
    SrForm(:form="seoForm" @updated="updateHandler" @submit="saveSeo")
</template>

<script lang="ts" setup>
const seoForm = {
  title: "",
  description: "",
  keyword: "",
};

const keywords = ref([]);

const updateHandler = ({ input, value, list }) => {
  console.log("updated", input, value);
};

const saveSeo = () => {
  console.log("saveSeo", seoForm);
};
</script>

<style lang="scss" scoped></style>
