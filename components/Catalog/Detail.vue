<script setup lang="ts">
import { EmitHandler } from "sr-content-2/assets/ts/utilities";
const props = defineProps({
  catalog: {
    type: Object,
    required: true,
  },
});

const { setPicture, editPicture } = usePicture();
const { editComponent, currentComponent } = useComponent(props.catalog.content);

const _brands = await $fetch("/api/product/brands");
const brands = _brands.map((b: any) => ({
  value: b.name,
  name: b.name,
}));

const { query: search, results, doSearch } = useSearch("/api/product/search");
const myResults = computed(() => {
  return results.value.products
    ? props.catalog.products.length > 0
      ? results.value.products.filter(
          (p: any) => !props.catalog.products.includes(p.web),
        )
      : results.value.products
    : [];
});

const emit = defineEmits([
  "component-gallery",
  "delete-product",
  "highlight-product",
]);

const componentGallery = ({ component }: any) => {
  currentComponent.value = { component };
  emit("component-gallery");
  //open the component gallery
  //on click on a component push the compinent default into the parent content
  //close the component gallery
};

const addItem = () => {
  (props.catalog.card as any).list.push("New item");
};

const deleteItem = (idx: number) => {
  (props.catalog.card as any).list.splice(idx, 1);
};

watch(search, () => {
  doSearch();
});
</script>

<template lang="pug">
SrContainer
  SrFormSelect(v-model="catalog.brand" :options="brands" label="Marca")
  div.catalog-card(v-if="catalog.card")
    SrPicture(:src="catalog.card.thumb" alt="placeholder" :editable="true" @media-gallery="EmitHandler($event, catalog.card, (data) => editPicture(data, $emit('media-modal')))")
    div  
      SrFormInput(v-model="catalog.card.label" label="Titulo")
      SrFormInput(v-model="catalog.card.order" label="Orden")
    ul.catalog-card-list
      li.catalog-card-item(v-for="(item, i) in catalog.card.list" :key="i")
        SrFormInput(v-model="catalog.card.list[i]")
        button(@click="deleteItem(i)")
          SrIcon(name="trash-o")
      li.catalog-card-item
        button(@click="addItem")
          SrIcon(name="plus-o")
  template(v-if="catalog.content")
    h2 Productos Destacados
    div.search-bar
      SrFormInput(label="Buscar producto" v-model="search")
      ol
        li(v-for="(product, i) in myResults" :key="i")
          button(@click="$emit('highlight-product', product)") 
            | {{ product.name}} | {{ product.web}}
    ul
      li(v-for="(product, i) in catalog.products" :key="i")
        button(@click="$emit('delete-product', i)")
          span {{ product }}
          span x
  SliderMain(
    :slides="catalog.slides"
    :editable="true" v-if="catalog.slides"
    @add-slide="catalog.slides.push($event)"
    @delete-slide="catalog.slides.splice($event, 1)"
    @media-gallery="EmitHandler($event, catalog, (data) => editPicture(data, $emit('media-modal')))"
  )
  component(
    v-for="(c, i) in catalog.content" :is="c.component"
    v-bind="c.props" :key="i"
    @media-gallery="EmitHandler($event, c, editPicture)"
    @icon-gallery="EmitHandler($event, c, editIcon)"
    @edit-props="editComponent($event, c, $emit('edit-props'))"
    @component-list="componentGallery"
  )
</template>

<style scoped lang="scss">
.catalog-card {
  display: flex;
  align-items: center;
  gap: pxToRem(10);
  .sr-picture {
    width: pxToRem(100);
    img {
      height: 100% !important;
    }
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: pxToRem(10);
    margin-bottom: pxToRem(20);
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: pxToRem(10);
    button {
      background: none;
      border: none;
      margin-top: auto;
      margin-bottom: pxToRem(4);
    }

    .sr-icon {
      color: $color-quivi-red;
      width: pxToRem(20);
      height: pxToRem(20);
    }
  }
}
</style>
