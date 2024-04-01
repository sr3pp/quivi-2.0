<script lang="ts" setup>
const props = defineProps({
  thumbs: {
    type: Array,
    default: () => [],
  },
  productName: {
    type: String,
    default: "",
  },
  productId: {
    type: String,
    default: "",
  },
});

const currentThumb = ref(props.thumbs.at(0));

const changeThumb = (thumb: any) => {
  currentThumb.value = thumb;
};
</script>

<template lang="pug">
.quivi-product-thumbs
    SrPicture(:src="`/products/${productId}/${currentThumb}`" :alt="productName"  width="100%" height="100%")
    ul.quivi-product-thumbs-list
      template(v-for="(thumb, i) in thumbs.filter(th => th)" :key="i")
        li.quivi-product-thumbs-item(v-if="thumb !== currentThumb")
          button(@click="changeThumb(thumb)")
            p {{ thumb }}
            SrPicture(:src="`/products/${productId}/${thumb}`" :alt="productName")
</template>

<style lang="scss">
.quivi-product-thumbs {
  &-list {
    display: flex;
    justify-content: space-between;
    margin-top: pxToRem(10);
    overflow: scroll;
    gap: pxToRem(10);
  }

  &-item {
    width: 33.3333%;
    flex-shrink: 0;
  }
}
</style>
