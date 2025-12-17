<script lang="ts" setup>
const editModal = ref(false);

const props = defineProps({
  thumbs: {
    type: Array,
    default: () => [],
  },
  productId: {
    type: String,
    default: "",
  },
  removeThumb: {
    type: Function,
    default: () => {},
  },
  addThumb: {
    type: Function,
    default: () => {},
  },
});

const newThumb = ref("");

const removeThumb = (i: number) => {
  props.removeThumb(i);
};

const addThumb = () => {
  if (newThumb.value) {
    props.addThumb(newThumb.value);
    newThumb.value = "";
  }
};
</script>

<template lang="pug">
SrGrid(tag="ul").quivi-product-edit-thumbs
  SrGridColumn.quivi-product-edit-thumbs-item(v-for="(thumb, i) in thumbs.filter(th => th)" :key="i" tag="li" :size="{mobile: '1', sm: '1/4'}")
    button.delete-thumb(@click="removeThumb(i)" type="button")
      SrIcon(name="trash-o")
    SrPicture(:src="`/products/${productId}/${thumb}`" :alt="thumb" width="100%" height="100%")
  SrGridColumn(tag="li").quivi-product-edit-thumbs-item
    SrFormInput(v-model="newThumb" placeholder="New thumb")
    button(@click="addThumb" type="button") Add Thumb
</template>

<style lang="scss" scoped>
.quivi-product-edit-thumbs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: pxToRem(8);

  .quivi-product-edit-thumbs-item {
    position: relative;
    width: calc(25% - pxToRem(8));
    height: pxToRem(100);
    margin-bottom: pxToRem(8);

    .sr-picture {
      width: 100%;
      background-color: $color-white;
      min-height: pxToRem(100);
    }

    .delete-thumb {
      position: absolute;
      top: pxToRem(8);
      right: pxToRem(8);
      z-index: 1;
      background-color: $color-quivi-red;
      border-radius: pxToRem(50);
      padding: pxToRem(4);
      border: none;
      color: $color-white;
      padding: pxToRem(4);
      .sr-icon {
        width: pxToRem(16);
        height: pxToRem(16);
      }
    }
  }
}
</style>
