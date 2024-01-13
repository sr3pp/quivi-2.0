<template lang="pug">
.catalogo
    component(v-for="(component, i) in catalogoContent" :is="component.component" :key="i" v-bind="component.props")

    SrContainer(:with-padding="true")
        SrGrid
          SrGridColumn(:size="{mobile: '1', sm: '1/2'}" class="catalogo-item" v-for="(item, i) in catalogo" :key="i")
            NuxtLink(:to="`/catalogo/${item.slug}`")
              SrPicture(:src="item.thumb" :alt="item.label" class="catalogo-banner")
              div.catalogo-item-description
                SrText(:text="item.label" class="title")
                ol.catalogo-item-description-list
                  li.catalogo-item-description-list-item(v-for="(el, i) in item.list" :key="i")
                    SrIcon(name="quivi-check-o")
                    SrText(:text="el")
    
</template>

<script lang="ts" setup>
const { data: catalogo } = await useFetch("/api/catalogo");
const { data: catalogoContent } = await useFetch(
  "/api/content?page=catalogo/index",
);
</script>

<style lang="scss" scoped>
.catalogo {
  &-item {
    align-items: center;

    a {
      display: flex;
      color: $color-text-color;
    }

    .sr-img {
      width: 30%;
    }

    &-description {
      padding: pxToRem(10);

      &-list {
        &-item {
          color: $color-quivi-gray;
          display: flex;
          align-items: center;

          .sr-icon {
            width: pxToRem(25);
            height: pxToRem(25);
          }
        }
      }
    }
  }

  > .sr-img {
    min-height: pxToRem(400);
  }
}
</style>
