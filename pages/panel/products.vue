<template lang="pug">
.products
  SrContainer(:with_space="true")
    label.massive-file
      span Carga Massiva
      span.spinner(v-if="uploading")
      input(type="file" name="dbFile" accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="handleFileUpload")
    SrText(value="Panel Products" kind="title" alignment="center")

    ul
      li(v-for="product in products")
        SrText(:value="product.name")

    Pagination(:pagination="pagination")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const { data } = await useFetch("/api/product");
const products = ref(data.value?.products);
const pagination = ref(data.value?.pagination);

const uploading: Ref<boolean> = ref(false);
const handleFileUpload = async (e: Event) => {
  console.log("handleFileUpload");
  uploading.value = true;

  const target = e.target as HTMLInputElement;
  const files = target.files ? target.files : [];
  const file = files[0];

  if (file) {
    const formData = new FormData();
    formData.append("dbFile", file);
    await useFetch("/api/product/masive", {
      method: "POST",
      body: formData,
    });

    uploading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.products {
  .massive-file {
    display: flex;

    input {
      display: none;
    }

    .spinner {
      margin-left: unit(10);
      width: unit(20);
      height: unit(20);
      background-color: red;
      border-radius: unit(50);
    }
  }
}
</style>
