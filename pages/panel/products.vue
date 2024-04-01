<template lang="pug">
.products
  SrContainer(:with-padding="true")
    label.massive-file
      span Carga Massiva
      span.spinner(v-if="uploading")
      input(type="file" name="dbFile" accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="handleFileUpload")
    SrText(text="Panel Products" class="title text-center")

    table
      thead
        tr
          th
            SrText(text="SAE")
          th
            SrText(text="WEB")
          th
            SrText(text="Nombre")
          th
            SrText(text="Actions")
      tbody
        tr(v-for="product in products")
          td
            SrText(:text="product.sae")
          td
            SrText(:text="product.web")
          td
            SrText(:text="product.name")
          td
            button(@click="editProduct(product)") Edit

    Pagination(:pagination="pagination")

    SrModal(:active="editModal" @close="editModal = false")
      template(#header)
        .sr-modal-header
          SrText(text="Edit product" class="title text-center")
      template(#body)
        .sr-modal-body
          SrForm(:fieldsets="productForm" @submit="updateProduct")
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
const editModal = ref(false);
const products = ref([]);
const pagination = ref({});
const productForm = ref([
  {
    fields: [
      {
        component: "SrFormInput",
        props: {
          name: "name",
          label: "Name",
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
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "price",
          label: "Precio",
          type: "number",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "priority",
          label: "Prioridad",
          type: "number",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "discount",
          label: "Descuento",
          type: "number",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "extra",
          label: "Extra",
          type: "number",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "meassure_unity",
          label: "Unidad de medida",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "line",
          label: "linea",
          required: true,
        },
      },
      {
        component: "ProductEditList",
        props: {
          select: {
            name: "Brand",
            label: "Marca",
            required: true,
            options: [
              { value: "1", text: "Option 1" },
              { value: "2", text: "Option 2" },
            ],
          },
        },
      },
      {
        component: "ProductEditList",
        props: {
          select: {
            name: "category",
            label: "Categoria",
            required: true,
            options: [
              { value: "1", text: "Option 1" },
              { value: "2", text: "Option 2" },
            ],
            onChange: (e: Event) => {
              console.log("set subcategorias: ", e);
            },
          },
        },
      },
      {
        component: "ProductEditList",
        props: {
          select: {
            name: "subcategory",
            label: "Subcategoria",
            required: true,
            options: [
              { value: "1", text: "Option 1" },
              { value: "2", text: "Option 2" },
            ],
          },
        },
      },
      {
        component: "ProductEditList",
        props: {
          select: {
            name: "years",
            label: "Anios",
            required: true,
            options: [
              { value: "1", name: "Option 1" },
              { value: "2", name: "Option 2" },
            ],
          },
        },
      },
      {
        component: "ProductEditList",
        props: {
          select: {
            name: "car_brands",
            label: "Marcas de auto",
            required: true,
            options: [
              { value: "1", name: "Option 1" },
              { value: "2", name: "Option 2" },
            ],
          },
        },
      },
      {
        component: "ProductEditList",
        props: {
          select: {
            name: "models",
            label: "modelos",
            required: true,
            options: [
              { value: "1", name: "Option 1" },
              { value: "2", name: "Option 2" },
            ],
          },
        },
      },
    ],
  },
]);

const { products: _products, pagination: _pagination } = await fetchProducts(
  route.path,
  page as string,
  search.value as string,
  filters.value as string,
);

products.value = _products;
pagination.value = _pagination;

const editProduct = (product: any) => {
  editModal.value = true;
  productForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.component == "SrFormInput") {
        field.props.value = product[field.props.name];
      }
    });
  });
};

const updateProduct = (data: any) => {
  console.log(data);
};

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
