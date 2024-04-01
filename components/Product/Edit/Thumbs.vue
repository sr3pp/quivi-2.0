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
});

console.log(props.thumbs, props.productId);
</script>

<template lang="pug">
SrGrid(tag="ul").quivi-product-edit-thumbs
  SrGridColumn.quivi-product-edit-thumbs-item(v-for="(thumb, i) in thumbs.filter(th => th)" :key="i" tag="li" :size="{mobile: '1', sm: '1/4'}")
    SrPicture(:src="`/products/${productId}/${thumb}`" :editable="true" width="100%" height="100%")
  SrGridColumn(tag="li").quivi-product-edit-thumbs-item
    button(@click="editModal = false") Add Thumb
</template>
