<template lang="pug">
.products
  UContainer(:with-padding="true")
    .products-header
      .header-title
        p.font-bebas.text-3xl Panel Products
        UInput(v-model="search" @keyup.enter="searchProduct" placeholder="Buscar")
        UButton(@click="searchProduct")
          SvgIcon(name="lupa-o")
      UButton.new-product(@click="newProduct" variant="secondary" label="Nuevo producto")
      label.massive-file
        span Carga Massiva
        Spinner(v-if="uploading")
        UInput(type="file" name="dbFile" accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="handleFileUpload")
      UButton.delete-all(@click="deleteAll" variant="secondary" label="Eliminar todos")


    UTable(
      :columns="columns"
      :data="products"
    )

    Pagination(:pagination="pagination")

    UModal(v-model:open="modalSw" description="Create or edit product")
      template(#title)
          p.title Edit product
      template(#body)
          PanelProductForm(
            :product="currentProduct"
            :product-brands="productBrands"
            :categories="categories"
            :subcategories="subcategories"
            :car-brands="carBrands"
            :car-models="carModels"
            @submit="updateProduct"
          )
</template>

<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { PanelProductRow } from "~/types";
import PanelProductForm from "~/components/Panel/ProductForm.vue";
import { fetchProducts } from "@/assets/ts/utilities";

definePageMeta({
  layout: "panel",
});

const UButton = resolveComponent("UButton");

const route = useRoute();
const { search: _search, page = 1, filters: _filters } = route.query;

const [productBrands, categories, subcategories, carBrands, carModels] =
  await Promise.all([
    $fetch("/api/product/brands"),
    $fetch("/api/category"),
    $fetch("/api/subcategory"),
    $fetch("/api/car-brand"),
    $fetch("/api/car-model"),
  ]);

const search = ref(_search as string);
const filters = ref(_filters as string);
const modalSw = ref(false);
const products: any = ref([]);
const pagination = ref({});
const currentProduct: Ref<PanelProductRow | null> = ref(null);

const prodctData = ref(
  await fetchProducts(route.path, page as string, _search as string, _filters),
);

products.value = prodctData.value.products;
pagination.value = prodctData.value.pagination;

const columns: TableColumn<PanelProductRow>[] = [
  {
    accessorKey: "sae",
    header: "SAE",
  },
  {
    accessorKey: "web",
    header: "Web",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-2" }, [
        h(UButton, {
          icon: "i-lucide-edit",
          color: "primary",
          variant: "ghost",
          size: "sm",
          "aria-label": "Edit",
          onClick: () => editProduct(row.original),
        }),
        h(UButton, {
          icon: "i-lucide-trash",
          color: "error",
          variant: "ghost",
          size: "sm",
          "aria-label": "Delete",
          onClick: () => deleteProduct(row.original),
        }),
      ]);
    },
    meta: {
      class: {
        td: "text-right",
      },
    },
  },
];

const searchProduct = async () => {
  const _prodcutData = await fetchProducts(
    route.path,
    page as string,
    search.value,
  );
  products.value = _prodcutData.products;
  pagination.value = _prodcutData.pagination;
};

const newProduct = () => {
  currentProduct.value = null;
  modalSw.value = true;
};

const editProduct = (_product: any) => {
  const product = products.value.find((p: any) => p.sae === _product.sae);
  currentProduct.value = product ?? null;
  modalSw.value = true;
};

const updateProduct = async (data: any) => {
  if (!currentProduct.value) {
    return saveProduct(data);
  }
  data._id = currentProduct.value._id;

  try {
    const product = await $fetch("/api/product", {
      method: "PUT",
      body: data,
    });
    modalSw.value = false;
  } catch (error) {
    console.error(error);
  }
};

const deleteProduct = async (_product: any) => {
  const product = products.value.find((p: any) => p.sae === _product.sae);
  const id = product._id;
  await $fetch(`/api/product/${id}`, {
    method: "DELETE",
  });
  const idx = products.value.findIndex((p: any) => p.sae === _product.sae);
  products.value.splice(idx, 1);
};

const saveProduct = async (product: any) => {
  await $fetch("/api/product", {
    method: "POST",
    body: product,
  });
};

const deleteAll = async () => {
  if (confirm("Are you sure you want to delete all products?")) {
    await $fetch("/api/admin/delete-all-products", {
      method: "DELETE",
    });
    products.value = [];
    pagination.value = {};
  }
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
  //TODO: Move notificaitons to TOAST system
  /*   notifications.value.push({
    title: "Procesando archivo",
    description: `El archivo se esta procesando, por favor espere`,
    status: true,
  }); */
  uploading.value = true;

  const target = e.target as HTMLInputElement;
  const files = target.files ? target.files : [];
  const file = files[0];

  if (file) {
    const formData = new FormData();
    formData.append("dbFile", file);
    await $fetch("/api/product/masive", {
      method: "POST",
      body: formData,
    });

    uploading.value = false;

    // TODO migrate to TOAST system
    /* notifications.value.push({
      title: "Listo!",
      description: `El archivo se proceso correctamente`,
      status: true,
    }); */
  }
};
</script>

<style lang="scss">
.products {
  .header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: pxToRem(20);
    .sr-form-input {
      margin-left: pxToRem(20);
      padding: pxToRem(0);
    }

    .quivi-button {
      margin-left: pxToRem(10);
      min-width: inherit;
    }

    .sr-icon {
      width: pxToRem(20);
      height: pxToRem(20);
    }
  }
  .new-product {
    margin-right: pxToRem(10);
  }
  .delete-all {
    margin-left: pxToRem(10);
    margin-right: 0;
  }
  .massive-file {
    color: $color-white;
    background: linear-gradient(
      90deg,
      $color-quivi-light-red,
      $color-quivi-red
    );
    padding: pxToRem(10);
    border-radius: pxToRem(25);
    cursor: pointer;
    display: flex;
    input {
      visibility: hidden;
      width: 0;
      height: 0;
      opacity: 0;
    }
    .spinner {
      background-color: $color-white !important;
      margin-left: 10px;
      width: 20px;
      height: 20px;
    }
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: pxToRem(20);
  }
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

  .product-form {
    fieldset {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;

      > *:not(.quivi-product-edit-list) {
        width: calc(33.33333% - pxToRem(8));
      }
      .quivi-product-edit-list {
        width: calc(50% - pxToRem(8));
      }
      .quivi-product-edit-thumbs {
        width: 100%;
      }
    }
  }
}
</style>
