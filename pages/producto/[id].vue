<template lang="pug">
.product-detail
    SrContainer(:with_space="true")
        SrText(value="Producto" kind="title")
</template>

<script lang="ts" setup>
const { params } = useRoute();
const { id } = params;
console.log(id);

//const product = await useFetch(`/api/product/${id}`);
</script>

<style lang="scss" scoped></style>
