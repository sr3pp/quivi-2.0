<template lang="pug">
.blog
    SrContainer(:with-padding="true")
        SrText(text="Blog" class="title")

        ul.blog-entry-list
            li.blog-entry-item 
                p entrada
</template>

<script lang="ts" setup>
const { data: blog } = await useFetch(`/api/blog`);
console.log(blog);
</script>

<style lang="scss" scoped>
.blog {
  &-entry-list {
    list-style: none;
    display: flex;
  }
  &-entry-item {
    border: 1px solid black;
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
