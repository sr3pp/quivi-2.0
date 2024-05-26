<template lang="pug">
.products
  SrContainer(:with-padding="true")
    .products-header
      .header-title
        SrText(text="Panel Products" class="title text-center")
        SrFormInput(v-model="search" @keyup.enter="searchProduct" placeholder="Buscar")
        QuiviButton(@click="searchProduct")
          SrIcon(name="lupa-o")
      label.massive-file
        span Carga Massiva
        Spinner(v-if="uploading")
        input(type="file" name="dbFile" accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="handleFileUpload")


    DetailTable(
      :headers="['sae', 'web', 'name', 'actions']"
      :data="products"
      @delete="deleteProduct"
      @edit="editProduct"
      @update:data="(val) => products = val"
      :actions="['edit']"
    )

    Pagination(:pagination="pagination")

    SrModal(ref="productModal")
      template(#header)
          SrText(text="Edit product" class="title text-center")
      template(#body)
          SrForm.product-form(:fieldsets="productForm" @submit="updateProduct")
</template>

<script lang="ts" setup>
import { fetchProducts } from "@/assets/ts/utilities";

const notifications = useState("notifications", (): any => []);

definePageMeta({
  layout: "panel",
});

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
const productModal = ref(false);
const products: any = ref([]);
const pagination = ref({});
const currentProduct = ref("");

const productForm = ref([
  {
    fields: [
      {
        component: "ProductEditThumbs",
        props: {
          name: "thumbs",
          thumbs: [],
          removeThumb: (i: number) => {
            productForm.value.forEach((fieldset: any) => {
              fieldset.fields.forEach((field: any) => {
                if (field.props.name === "thumbs") {
                  field.props.thumbs.splice(i, 1);
                }
              });
            });
          },
          addThumb: (thumb: string) => {
            productForm.value.forEach((fieldset: any) => {
              fieldset.fields.forEach((field: any) => {
                if (field.props.name === "thumbs") {
                  field.props.thumbs.push(thumb);
                }
              });
            });
          },
        },
      },
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
          step: "0.01",
          required: true,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "priority",
          label: "Prioridad",
          type: "number",
          value: "99",
          required: false,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "discount",
          label: "Descuento",
          type: "number",
          value: 0,
          required: false,
        },
      },
      {
        component: "SrFormInput",
        props: {
          name: "extra",
          label: "Extra",
          required: false,
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
          required: false,
        },
      },
      {
        component: "SrFormSelect",
        props: {
          name: "brand",
          label: "Marca",
          required: true,
          options: productBrands.map((brand: any) => ({
            value: brand._id,
            name: brand.name,
          })),
        },
      },
      {
        component: "SrFormSelect",
        props: {
          name: "category",
          label: "Categoria",
          required: true,
          options: categories.map((brand: any) => ({
            value: brand._id,
            name: brand.name,
          })),
        },
      },
      {
        component: "SrFormSelect",
        props: {
          name: "subcategory",
          label: "Subcategoria",
          required: true,
          options: subcategories.map((brand: any) => ({
            value: brand._id,
            name: brand.name,
          })),
        },
      },

      {
        component: "ProductEditList",
        props: {
          name: "years",
          select: {
            label: "Anios",
            required: true,
            options: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => ({
                value: i + 1980,
                name: String(i + 1980),
              }),
            ),
          },
          items: [],
          removeItem,
          addItem,
        },
      },
      {
        component: "ProductEditList",
        props: {
          name: "car_brands",
          select: {
            label: "Marcas de auto",
            required: true,
            options: carBrands.map((brand: any) => ({
              value: brand._id,
              name: brand.name,
            })),
          },
          items: [],
          removeItem,
          addItem,
        },
      },
      {
        component: "ProductEditList",
        props: {
          name: "models",
          value: [],
          select: {
            label: "modelos",
            required: true,
            options: carModels.map((model: any) => ({
              value: model._id,
              name: model.name,
            })),
          },
          items: [],
          removeItem,
          addItem,
        },
      },
    ],
  },
]);

const prodctData = ref(
  await fetchProducts(route.path, page as string, _search as string, _filters),
);

products.value = prodctData.value.products;
pagination.value = prodctData.value.pagination;

const searchProduct = async () => {
  const _prodcutData = await fetchProducts(
    route.path,
    page as string,
    search.value,
  );
  products.value = _prodcutData.products;
  pagination.value = _prodcutData.pagination;
};

const editProduct = (_product: any) => {
  const product = products.value.find((p: any) => p.sae === _product.sae);
  currentProduct.value = product._id;
  (productModal.value as any).toggle();
  productForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.name == "years") {
        field.props.items = product[field.props.name].map((year: any) => ({
          value: year,
          name: year,
        }));
      } else if (field.component === "ProductEditList") {
        field.props.items = product[field.props.name].map((item: any) => {
          let id, name;
          if (field.props.name === "car_brands") {
            const brand: any = carBrands.find(
              (brand: any) => brand._id === item,
            );
            id = brand._id;
            name = brand.name;
          } else {
            const model: any = carModels.find(
              (model: any) => model._id === item,
            );
            id = model._id;
            name = model.name;
          }
          return {
            value: id,
            name,
          };
        });
      } else if (field.props.name === "thumbs") {
        field.props.thumbs = product[field.props.name].filter(
          (th: string) => th,
        );
        field.props.productId = product._id;
      } else {
        field.props.value = String(product[field.props.name]);
      }
    });
  });
};

const updateProduct = async (data: any) => {
  productForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.component === "ProductEditList") {
        data[field.props.name] = field.props.items.map(
          (item: any) => item.value,
        );
      } else if (field.component === "ProductEditThumbs") {
        data[field.props.name] = field.props.thumbs;
      }
    });
  });

  data._id = currentProduct.value;

  try {
    const product = await $fetch("/api/product", {
      method: "PUT",
      body: data,
    });
    (productModal.value as any).toggle();
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
  notifications.value.push({
    title: "Procesando archivo",
    description: `El archivo se esta procesando, por favor espere`,
    status: true,
  });
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

    notifications.value.push({
      title: "Listo!",
      description: `El archivo se proceso correctamente`,
      status: true,
    });
  }
};

function removeItem(idx: number, key: string) {
  productForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.name === key) {
        field.props.items.splice(idx, 1);
      }
    });
  });
}
function addItem(item: any, key: string) {
  productForm.value.forEach((fieldset: any) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.name === key) {
        field.props.items.push(item);
      }
    });
  });
}
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
