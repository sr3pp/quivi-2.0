<template lang="pug">
.seo-wizzard
    SrForm(:fieldsets="seoForm" @submit="saveSeo" submit="Save")
</template>

<script lang="ts" setup>
const seoForm = ref([
  {
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "title",
          label: "Title",
          required: true,
          value: "",
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "description",
          label: "Description",
          required: true,
          value: "",
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "keyword",
          label: "Keyword",
          required: true,
          value: "",
        },
      },
    ],
  },
]);

const keywords = ref([]);

const saveSeo = (data: any) => {
  console.log("saveSeo", data);
};
</script>

<style lang="scss" scoped></style>
