<template lang="pug">
UForm.product-form(:schema="schema" :state="state" @submit="onSubmit")
  fieldset
    UFormField(label="SAE" name="sae")
      UInput(v-model="state.sae" placeholder="SAE")
    UFormField(label="Web" name="web")
      UInput(v-model="state.web" placeholder="Web")
    UFormField(label="Name" name="name")
      UInput(v-model="state.name" placeholder="Name")
    UFormField(label="Description" name="description")
      UTextarea(v-model="state.description" placeholder="Description")
    UFormField(label="Precio" name="price")
      UInput(v-model="state.price" type="number" step="0.01" placeholder="0.00")
    UFormField(label="Prioridad" name="priority")
      UInput(v-model="state.priority" type="number" placeholder="99")
    UFormField(label="Descuento" name="discount")
      UInput(v-model="state.discount" type="number" placeholder="0")
    UFormField(label="Extra" name="extra")
      UInput(v-model="state.extra" placeholder="Extra")
    UFormField(label="Unidad de medida" name="meassure_unity")
      UInput(v-model="state.meassure_unity" placeholder="Unidad de medida")
    UFormField(label="Linea" name="line")
      UInput(v-model="state.line" placeholder="Linea")

    UFormField(label="Marca" name="brand")
      USelect(v-model="state.brand" :items="brandOptions")
    UFormField(label="Categoria" name="category")
      USelect(v-model="state.category" :items="categoryOptions")
    UFormField(label="Subcategoria" name="subcategory")
      USelect(v-model="state.subcategory" :items="subcategoryOptions")

    .thumbs-section
      h3 Imágenes
      .thumbs-grid
        .thumb-item(v-for="(thumb, i) in state.thumbs.filter(th => th)" :key="i")
          UButton.delete-thumb(@click="removeThumb(i)" type="button" icon="i-lucide-trash" color="error" size="xs" variant="ghost")
          NuxtImg(:src="`/products/${state.productId}/${thumb}`" :alt="thumb" width="100" height="100")
        .thumb-item.add-thumb
          UInput(v-model="newThumb" placeholder="Nueva imagen")
          UButton(@click="addThumbHandler" type="button" label="Agregar" size="xs")

    .list-section
      UFormField(label="Años" name="yearsItems")
        UInputMenu(
          v-model="state.yearsItems"
          multiple
          :items="yearsOptions"
          label-key="name"
          by="value"
          delete-icon="i-lucide-trash"
          placeholder="Selecciona años"
        )

    .list-section
      UFormField(label="Marcas de auto" name="carBrandsItems")
        UInputMenu(
          v-model="state.carBrandsItems"
          multiple
          :items="carBrandsOptions"
          label-key="name"
          by="value"
          delete-icon="i-lucide-trash"
          placeholder="Selecciona marcas"
        )

    .list-section
      UFormField(label="Modelos" name="modelsItems")
        UInputMenu(
          v-model="state.modelsItems"
          multiple
          :items="carModelsOptions"
          label-key="name"
          by="value"
          delete-icon="i-lucide-trash"
          placeholder="Selecciona modelos"
        )

  .mt-4.flex.justify-end
    UButton(type="submit" label="Guardar" color="primary")
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

type Option = { value: string; name: string };

const props = defineProps<{
  product?: any | null;
  productBrands: Array<any>;
  categories: Array<any>;
  subcategories: Array<any>;
  carBrands: Array<any>;
  carModels: Array<any>;
}>();

const emit = defineEmits<{ submit: [any] }>();

const schema = z
  .object({
    sae: z.string().min(1, "Requerido"),
    web: z.string().min(1, "Requerido"),
    name: z.string().min(1, "Requerido"),
    description: z.string().min(1, "Requerido"),
    price: z.coerce.number().min(0),
    priority: z.coerce.number().optional().default(99),
    discount: z.coerce.number().optional().default(0),
    extra: z.string().optional().nullable(),
    meassure_unity: z.string().min(1, "Requerido"),
    line: z.string().optional().nullable(),
    brand: z.string().min(1, "Requerido"),
    category: z.string().min(1, "Requerido"),
    subcategory: z.string().min(1, "Requerido"),
    thumbs: z.array(z.string()).optional().default([]),
    productId: z.string().optional().default(""),
    yearsItems: z
      .array(z.object({ value: z.number(), name: z.string() }))
      .min(1, "Requerido"),
    carBrandsItems: z
      .array(z.object({ value: z.string(), name: z.string() }))
      .min(1, "Requerido"),
    modelsItems: z
      .array(z.object({ value: z.string(), name: z.string() }))
      .min(1, "Requerido"),
  })
  .passthrough();

type FormState = z.infer<typeof schema>;

console.log("props.product", props.productBrands);

const newThumb = ref("");
const brandOptions = computed<Option[]>(() =>
  props.productBrands.map((brand: any) => ({
    value: brand._id,
    name: brand.name,
  })),
);
const categoryOptions = computed<Option[]>(() =>
  props.categories.map((category: any) => ({
    value: category._id,
    name: category.name,
  })),
);
const subcategoryOptions = computed<Option[]>(() =>
  props.subcategories.map((subcategory: any) => ({
    value: subcategory._id,
    name: subcategory.name,
  })),
);

const yearsOptions = computed<Option[]>(() =>
  Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) => ({
    value: i + 1980,
    name: String(i + 1980),
  })),
);

const carBrandsOptions = computed<Option[]>(() =>
  props.carBrands.map((brand: any) => ({
    value: brand._id,
    name: brand.name,
  })),
);

const carModelsOptions = computed<Option[]>(() =>
  props.carModels.map((model: any) => ({
    value: model._id,
    name: model.name,
  })),
);

const state = reactive<FormState>({
  sae: "",
  web: "",
  name: "",
  description: "",
  price: 0,
  priority: 99,
  discount: 0,
  extra: "",
  meassure_unity: "",
  line: "",
  brand: "",
  category: "",
  subcategory: "",
  thumbs: [],
  productId: "",
  yearsItems: [],
  carBrandsItems: [],
  modelsItems: [],
});

const mapItems = (ids: Array<any> | undefined, options: Option[]) => {
  if (!ids || !Array.isArray(ids)) return [];
  return ids
    .map((id) => options.find((opt) => opt.value === id))
    .filter(Boolean) as Option[];
};

const mapYears = (years: Array<number> | undefined) => {
  if (!years || !Array.isArray(years)) return [];
  return years.map((year) => ({ value: year, name: String(year) }));
};

const resetState = (product?: any | null) => {
  state.sae = product?.sae ?? "";
  state.web = product?.web ?? "";
  state.name = product?.name ?? "";
  state.description = product?.description ?? "";
  state.price = product?.price ?? 0;
  state.priority = product?.priority ?? 99;
  state.discount = product?.discount ?? 0;
  state.extra = product?.extra ?? "";
  state.meassure_unity = product?.meassure_unity ?? "";
  state.line = product?.line ?? "";
  state.brand =
    typeof product?.brand === "object"
      ? product?.brand?._id
      : (product?.brand ?? "");
  state.category =
    typeof product?.category === "object"
      ? product?.category?._id
      : (product?.category ?? "");
  state.subcategory =
    typeof product?.subcategory === "object"
      ? product?.subcategory?._id
      : (product?.subcategory ?? "");
  state.thumbs = Array.isArray(product?.thumbs)
    ? product?.thumbs.filter((th: string) => th)
    : [];
  state.productId = product?._id ?? "";
  state.yearsItems = mapYears(product?.years);
  state.carBrandsItems = mapItems(product?.car_brands, carBrandsOptions.value);
  state.modelsItems = mapItems(product?.models, carModelsOptions.value);
};

watch(
  () => props.product,
  (product) => {
    resetState(product ?? null);
  },
  { immediate: true },
);

watch(
  () => [props.carBrands, props.carModels],
  () => {
    resetState(props.product ?? null);
  },
);

const addThumb = (thumb: string) => {
  state.thumbs.push(thumb);
};

const addThumbHandler = () => {
  if (newThumb.value) {
    addThumb(newThumb.value);
    newThumb.value = "";
  }
};

const removeThumb = (idx: number) => {
  state.thumbs.splice(idx, 1);
};

const onSubmit = (event: FormSubmitEvent<FormState>) => {
  const data = { ...event.data } as any;
  data.years = data.yearsItems.map((item: any) => item.value);
  data.car_brands = data.carBrandsItems.map((item: any) => item.value);
  data.models = data.modelsItems.map((item: any) => item.value);
  delete data.yearsItems;
  delete data.carBrandsItems;
  delete data.modelsItems;
  emit("submit", data);
};
</script>

<style lang="scss" scoped>
.product-form {
  fieldset {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    > * {
      flex: 1 1 calc(33.333% - 1rem);
      min-width: 200px;
    }
  }

  .thumbs-section {
    width: 100%;
    margin-top: 1.5rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .thumbs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;

      .thumb-item {
        position: relative;
        height: 120px;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &.add-thumb {
          justify-content: center;
        }

        .delete-thumb {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          z-index: 1;
        }

        img {
          width: 100%;
          height: 80px;
          object-fit: cover;
          border-radius: 0.25rem;
        }
      }
    }
  }

  .list-section {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
}
</style>
