<template lang="pug">
div
  UContainer(:with-padding="true")
    div(class="mb-5 flex flex-wrap items-center justify-between gap-2.5")
      div(class="mb-5 flex items-center justify-between")
        p.font-bebas.text-3xl Panel Products
        UInput(v-model="search" @keyup.enter="searchProduct" placeholder="Buscar" class="ml-5 p-0")
        UButton(@click="searchProduct" class="ml-2.5 min-w-[unset]")
          SvgIcon(name="lupa-o" class="size-5")
      UButton(@click="newProduct" variant="secondary" label="Nuevo producto" class="mr-2.5")
      label(
        class="flex cursor-pointer rounded-[1.5625rem] bg-gradient-to-r from-[var(--color-quivi-light-red)] to-[var(--color-quivi-red)] p-2.5 text-[var(--color-white)]"
      )
        span Carga Massiva
        Spinner(v-if="uploading" class="ml-2.5 !h-5 !w-5 !bg-[var(--color-white)]")
        UInput(type="file" name="dbFile" accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="handleFileUpload" class="hidden")
      UButton(@click="deleteAll" variant="secondary" label="Eliminar todos" class="ml-2.5 mr-0")


    UTable(
      :columns="columns"
      :data="products"
    )

    UPagination(
      v-model="pageModel"
      :items-per-page="itemsPerPage"
      :total="pagination.total || 0"
      @update:page="handlePage"
      color="primary"
      class="mt-5"
    )

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
const router = useRouter();
const { search: _search, filters: _filters } = route.query;
const pageQuery = computed(() => (route.query.page as string) || "1");

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
const products = ref<PanelProductRow[]>([]);
const pagination = ref<{ total?: number; perPage?: number }>({});
const currentProduct: Ref<PanelProductRow | null> = ref(null);
const pageModel = ref(Number(pageQuery.value));
const itemsPerPage = computed(() => Number(pagination.value.perPage ?? 10));

const prodctData = ref(
  await fetchProducts(
    route.path,
    pageQuery.value,
    _search as string,
    _filters as string,
  ),
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
    pageQuery.value,
    search.value,
  );
  products.value = _prodcutData.products;
  pagination.value = _prodcutData.pagination;
};

const newProduct = () => {
  currentProduct.value = null;
  modalSw.value = true;
};

const editProduct = (_product: PanelProductRow) => {
  const product = products.value.find((p) => p.sae === _product.sae);
  currentProduct.value = product ?? null;
  modalSw.value = true;
};

const updateProduct = async (data: Record<string, unknown>) => {
  if (!currentProduct.value) {
    return saveProduct(data);
  }
  data._id = currentProduct.value._id;

  try {
    await $fetch("/api/product", {
      method: "PUT",
      body: data,
    });
    modalSw.value = false;
  } catch (error) {
    console.error(error);
  }
};

const deleteProduct = async (_product: PanelProductRow) => {
  const product = products.value.find((p) => p.sae === _product.sae);
  if (!product?._id) return;
  const id = product._id;
  await $fetch(`/api/product/${id}`, {
    method: "DELETE",
  });
  const idx = products.value.findIndex((p) => p.sae === _product.sae);
  products.value.splice(idx, 1);
};

const saveProduct = async (product: Record<string, unknown>) => {
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
    pageModel.value = Number((page as string) || 1);
    products.value = _products;
    pagination.value = _pagination;
  },
);

const handlePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      page,
    },
  });
};

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
