<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  select: {
    type: Object,
    default: () => ({
      label: "",
      value: "",
    }),
  },
  items: {
    type: Array,
    default: () => [],
  },
  addItem: {
    type: Function,
    default: () => {},
  },
  removeItem: {
    type: Function,
    default: () => {},
  },
});

const searchTerm = ref("");
const results = computed(() =>
  props.select.options.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
      !props.items.includes(item),
  ),
);

const addItem = (item: any) => {
  props.addItem(item, props.name);
};

const removeItem = (idx: number) => {
  props.removeItem(idx, props.name);
};
</script>

<template lang="pug">
.quivi-product-edit-list
  SrText(:text="`Edit ${select.label}`" class="title text-center")
  .quivi-product-edit-list-search(:class="{ active: searchTerm.length > 0 }")
    SrFormInput(v-model="searchTerm" placeholder="Search")
    ul.quivi-product-edit-list-results
      li.quivi-product-edit-list-results-item(v-for="(item, i) in results" :key="i")
        button(@click="addItem(item)" type="button") {{ item.name }}
  ul.quivi-product-edit-list-items
    li.quivi-product-edit-list-items-item(v-for="(item, i) in items" :key="i")
      button(@click="removeItem(i)" type="button") 
        SrIcon(name="trash-o")
        span {{ item.name }}
</template>

<style lang="scss" scoped>
.quivi-product-edit-list {
  &:not(:last-of-type) {
    padding-bottom: pxToRem(20);
    border-bottom: {
      style: solid;
      color: $color-quivi-darkest-red;
      width: pxToRem(1);
    }
  }
  &-search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: pxToRem(20);
    position: relative;
    z-index: 1;
    &.active {
      z-index: 4;
      .quivi-product-edit-list-results {
        max-height: 100vh;
        opacity: 1;
      }
    }
  }
  &-results {
    z-index: 3;
    position: absolute;
    width: 100%;
    background-color: $color-white;
    border: {
      style: solid;
      color: $color-quivi-darkest-red;
      width: pxToRem(1);
      radius: pxToRem(5);
    }
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    top: 100%;
    left: 0;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease-in-out;

    &-item {
      padding: pxToRem(6);
      cursor: pointer;
      &:hover {
        background-color: $color-quivi-light-gray;
      }
    }
  }
  &-items {
    display: flex;
    gap: pxToRem(10);
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    border: {
      style: solid;
      color: $color-quivi-darkest-red;
      width: pxToRem(1);
      radius: pxToRem(5);
    }
    padding: pxToRem(10);

    &-item {
      padding: pxToRem(6);
      background-color: $color-quivi-light-gray;
      border-radius: pxToRem(6);
      button {
        padding: 0;
        display: flex;
        align-items: center;
        background: none;
        border: none;
        color: $color-white;
        .sr-icon {
          width: pxToRem(16);
          height: pxToRem(16);
          margin-right: pxToRem(5);
        }
      }
    }
  }
}
</style>
