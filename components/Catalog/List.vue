<script setup lang="ts">
import { proccessContent } from "sr-content-2/assets/ts/utilities";

const props = defineProps({
  catalogs: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["set-catalog", "delete-catalog"]);

const getNewCatalog = () => ({
  isNew: false,
  sw: true,
  card: {
    order: props.catalogs.length,
    slug: "",
    label: "",
    thumb: "https://via.placeholder.com/150",
    list: [],
  },
  brand: "",
  slides: [],
  products: [],
  content: [
    {
      component: "SrContainer",
      props: {
        content: [
          {
            component: "SrContainer",
            props: {
              editable: true,
              contained: false,
              content: [
                {
                  component: "SrText",
                  props: {
                    editable: true,
                    text: "Hello World",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
});

const catalog: any = ref(getNewCatalog());

const setCatalog = async (_catalog: string) => {
  if (_catalog == "new") {
    catalog.value = getNewCatalog();
    catalog.value.isNew = true;
    catalog.value.sw = true;
  } else {
    const { content, card, slides, products, brand } = await $fetch(
      `/api/content?page=catalogo/${_catalog}&section=content,card,slides,products,brand`,
    );

    (catalog.value.content as any) = proccessContent(content, true);
    catalog.value.card = card;
    catalog.value.slides = slides;
    catalog.value.products = products;
    catalog.value.brand = brand;
  }

  emit("set-catalog", catalog.value);
};

const deleteCatalog = async (catalog: string) => {
  if (confirm("Are you sure?")) {
    //await $fetch(`/api/content?page=catalogo/${catalog}`, { method: "DELETE" });
    emit("delete-catalog", catalog);
  }
};
</script>

<template lang="pug">
ul.catalog-list
  li.catalog-list-item(v-for="(c, i) in catalogs" :key="i")
    SrFormBox(v-model="catalog.card.slug" type="radio" name="catalog" :value="c.slug" :label="c.label" @change="setCatalog(c.slug)")
    button(@click="deleteCatalog(c.slug)")
      SrIcon(name="trash-o")
  li
    button(@click="setCatalog('new')") New Catalog
</template>

<style scoped lang="scss">
.catalog-list {
  display: flex;
  flex-wrap: wrap;
  gap: pxToRem(10);

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      background: none;
      border: none;
      padding: pxToRem(4);

      .sr-icon {
        color: $color-quivi-red;
        width: pxToRem(20);
        height: pxToRem(20);
      }
    }
  }
}
</style>
