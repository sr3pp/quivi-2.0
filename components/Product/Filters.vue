<template lang="pug">
ul.quivi-product-filters
    li.quivi-product-filters-item(v-for="(item, i) in filtersForm" :key="i")
        label
            span {{item.label}}
            input(type="text" v-model="item.value" @change="setChildren(item)" :list="item.label")
            datalist(:id="item.label")
                option(v-for="(opt, j) in item.options" :key="j" :id="opt.value" :value="opt.label")
    li.quivi-product-filters-item
      Button(@click="filter" label="Filtrar")
</template>

<script lang="ts" setup>
const getCarBrands = async (): Promise<any[]> => {
  const { data: brands }: any = await useFetch("/api/car-brand");
  return brands.value;
};

const carBrands = await getCarBrands();

const carBrandsOptions = carBrands.map((brand: any) => ({
  label: brand.name,
  value: brand._id,
  models: brand.models,
}));

const getCategories = async (): Promise<any[]> => {
  const { data: categories }: any = await useFetch("/api/category");
  return categories.value;
};
const categories = await getCategories();
const categoryOptions = categories.map((category: any) => ({
  label: category.name,
  value: category._id,
}));

const getMotors = async (): Promise<any[]> => {
  const { data: motors }: any = await useFetch("/api/motor");
  return motors.value;
};

const motors = await getMotors();
const motorsOptions = ref(
  motors.map((motor: any) => ({
    label: motor.name,
    value: motor._id,
  })),
);

const createYearList = () => {
  const startYear = 1999;
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => i + startYear,
  );
  return years;
};

const filtersForm: any = ref([
  {
    label: "Vehiculo",
    value: "",
    options: carBrandsOptions,
    key: "car_brands",
  },
  {
    label: "Submarca",
    value: "",
    options: [],
    key: "car_models",
  },
  {
    label: "Año",
    value: "",
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
    value: "",
    options: motorsOptions,
    key: "motors",
  },
  {
    label: "Categoria",
    value: "",
    options: categoryOptions,
    key: "category",
  },
]);

const emit = defineEmits(["filter"]);

const filter = async () => {
  const filters: any = {};
  filtersForm.value.forEach((element: any) => {
    if (element.value) {
      const { value } = element.options.find(
        (opt: any) => opt.label == element.value,
      );
      filters[element.key] = value;
    }
  });

  emit("filter", filters);
};

const setChildren = (item: any) => {
  if (item.label == "Vehiculo") {
    const { models } = item.options.find((opt: any) => opt.label == item.value);

    filtersForm.value[1].options = models.map((model: any) => ({
      label: model.name,
      value: model._id,
    }));
  } else if (item.label == "Submarca") {
    //reduce motors options
    let newMotors;
    if (item.value == "") {
      newMotors = motors;
    } else {
      newMotors = motors.filter((motor: any) => {
        const { models } = motor;
        const model = models.find((model: any) => model.name == item.value);
        return model;
      });
    }

    filtersForm.value[3].options = newMotors.map((motor: any) => ({
      label: motor.name,
      value: motor._id,
    }));
  }
};

const route = useRoute();
watch(
  () => route.query,
  async ({ filters }) => {
    if (!filters) {
      filtersForm.value.forEach((item: any) => {
        item.value = "";
      });
    }
  },
);
</script>

<style lang="scss" scoped>
.quivi-product-filters {
  &-item {
    label {
      display: flex;
      flex-direction: column;
    }
    input {
      appearance: none;
      height: unit(40);
      padding: unit(10);
      border: solid unit(2) $color-quivi-light-gray;
      border-radius: unit(8);
    }

    &:not(:last-child) {
      margin-bottom: unit(20);
    }
  }
}
</style>
