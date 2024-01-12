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
        span {{ product.sae }}

    Pagination(:pagination="pagination")
</template>

<script lang="ts" setup>
import { fetchProducts } from "@/assets/ts/utilities";

definePageMeta({
  layout: "panel",
});

const route = useRoute();
const { search: _search, page = 1, filters: _filters } = route.query;

const search = ref(_search as string);
const filters = ref(_filters as string);
const products = ref([]);
const pagination = ref({});

const { products: _products, pagination: _pagination } = await fetchProducts(
  route.path,
  page as string,
  search.value as string,
  filters.value as string,
);

products.value = _products;
pagination.value = _pagination;

watch(
  () => route.query,
  async ({ search: _search, page, filters: _filters }) => {
    const { products: _products, pagination: _pagination } =
      await fetchProducts(
        route.path,
        page as string,
        _search as string,
        _filters,
      );
    search.value = _search as string;
    filters.value = _filters as string;
    products.value = _products;
    pagination.value = _pagination;
  },
);

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
      margin-left: pxToRem(10);
      width: pxToRem(20);
      height: pxToRem(20);
      background-color: red;
      border-radius: pxToRem(50);
    }
  }
}
</style>
