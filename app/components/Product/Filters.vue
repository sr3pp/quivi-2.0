<template lang="pug">
ul.flex.flex-col.gap-4
    li(v-for="(item, i) in filtersForm" :key="i")
        UFormField(:label="item.label")
            UInputMenu.w-full(
                v-model="item.value"
                :items="item.options"
                option-attribute="label"
                :placeholder="item.placeholder"
                @update:model-value="setChildren(item)"
            )
    li.flex.justify-between
      UButton(@click="filter" label="Filtrar")
      UButton(v-if="filters" to="/tienda" label="Limpiar Filtros")
</template>

<script lang="ts" setup>
import type { FilterItem } from "~/types";

const props = defineProps<{
  filters?: string;
}>();

const getCarBrands = async (): Promise<any[]> => {
  const { data: brands }: any = await useFetch("/api/car-brand");
  return brands.value;
};

const carBrands = await getCarBrands();

const carBrandsOptions = carBrands.map((brand: any) => ({
  label: brand.name.toUpperCase(),
  value: brand._id,
  models: brand.models,
}));

const getCategories = async (): Promise<any[]> => {
  const { data: categories }: any = await useFetch("/api/category");
  return categories.value;
};
const categories = await getCategories();
const categoryOptions = categories.map((category: any) => ({
  label: category.name.toUpperCase(),
  value: category._id,
}));

const getMotors = async (): Promise<any[]> => {
  const { data: motors }: any = await useFetch("/api/motor");
  return motors.value;
};

const motors = await getMotors();
const motorsOptions = motors.map((motor: any) => ({
  label: motor.name.toUpperCase(),
  value: motor._id,
}));

const createYearList = () => {
  const startYear = 1999;
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => i + startYear,
  );
  return years;
};

const filtersForm = ref<FilterItem[]>([
  {
    label: "Vehiculo",
    value: null,
    placeholder: "Selecciona la marca",
    options: carBrandsOptions,
    key: "car_brands",
  },
  {
    label: "Submarca",
    value: null,
    placeholder: "Selecciona la submarca",
    options: [],
    key: "car_models",
  },
  {
    label: "Año",
    value: null,
    placeholder: "Selecciona el año",
    key: "years",
    options: createYearList()
      .reverse()
      .map((year: any) => ({
        label: year,
        value: year,
      })),
  },
  {
    label: "Motor",
    value: null,
    placeholder: "Selecciona el motor",
    options: motorsOptions,
    key: "motors",
  },
  {
    label: "Refacción",
    value: null,
    placeholder: "Selecciona la categoria",
    options: categoryOptions,
    key: "category",
  },
]);

const emit = defineEmits(["filter"]);

const getSelectedLabel = (item: FilterItem) =>
  typeof item.value === "object" && item.value
    ? item.value.label
    : (item.value as string);

const getSelectedValue = (item: FilterItem) => {
  if (!item.value) return null;
  if (typeof item.value === "object") return item.value.value;
  const opt = item.options.find((o) => o.label === item.value);
  return opt?.value ?? item.value;
};

const filter = async () => {
  const filters: Record<string, any> = {};
  filtersForm.value.forEach((element) => {
    const value = getSelectedValue(element);
    if (value) {
      filters[element.key] = value;
    }
  });

  emit("filter", filters);
};

const setChildren = (item: FilterItem) => {
  if (item.label == "Vehiculo") {
    const selectedLabel = getSelectedLabel(item);
    const selected = item.options.find((opt) => opt.label == selectedLabel);
    const models = selected?.models || [];
    const subBrand = filtersForm.value.find((f) => f.key === "car_models");
    if (!subBrand) return;

    subBrand.options = models.map((model: any) => ({
      label: model.name.toUpperCase(),
      value: model._id,
    }));
    subBrand.value = null;
  } else if (item.label == "Submarca") {
    let newMotors;
    const selectedLabel = getSelectedLabel(item);

    if (!selectedLabel) {
      newMotors = motors;
    } else {
      newMotors = motors.filter((motor: any) => {
        const { models } = motor;
        const model = models.find((model: any) => model.name == selectedLabel);
        return model;
      });
    }

    const motorFilter = filtersForm.value.find((f) => f.key === "motors");
    if (!motorFilter) return;

    motorFilter.options = newMotors.map((motor: any) => ({
      label: motor.name.toUpperCase(),
      value: motor._id,
    }));
    motorFilter.value = null;
  }
};

const applyFiltersFromQuery = (filters?: string) => {
  if (!filters) {
    filtersForm.value.forEach((item) => {
      item.value = null;
    });
    return;
  }

  const parsed = filters
    .split("|")
    .map((pair) => pair.split("."))
    .filter((pair) => pair.length === 2);

  parsed.forEach(([key, value]) => {
    if (!key || !value) return;
    const item = filtersForm.value.find((f) => f.key === key);
    if (!item) return;

    const option = item.options.find((opt) => String(opt.value) === value);
    item.value = option ?? value;

    if (item.label === "Vehiculo") {
      setChildren(item);
    }
  });

  const subBrand = filtersForm.value.find((f) => f.key === "car_models");
  if (subBrand?.value) {
    setChildren(subBrand);
  }
};

watch(
  () => props.filters,
  (filters) => {
    applyFiltersFromQuery(filters);
  },
  { immediate: true },
);
</script>
