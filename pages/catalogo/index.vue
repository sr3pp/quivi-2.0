<template lang="pug">
.catalogo
    component(v-for="(component, i) in catalogoContent" :is="component.component" :key="i" v-bind="component.props")

    SrContainer(:with_space="true")
        SrGrid
            .sr-grid-col-1(class="sr-grid-col-1/2 catalogo-item" v-for="(item, i) in catalogo" :key="i")
                NuxtLink(:to="`/catalogo/${item.slug}`")
                  SrImg(:src="item.thumb" :alt="item.label" class="catalogo-banner")
                  div.catalogo-item-description
                      SrText(:value="item.label" kind="title")
                      ol.catalogo-item-description-list
                          li.catalogo-item-description-list-item(v-for="(el, i) in item.list" :key="i")
                              SrIcon(value="quivi-check-o")
                              SrText(:value="el")
    
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
      padding: unit(10);

      &-list {
        &-item {
          color: $color-quivi-gray;
          display: flex;
          align-items: center;

          .sr-icon {
            width: unit(25);
            height: unit(25);
          }
        }
      }
    }
  }

  > .sr-img {
    min-height: unit(400);
  }
}
</style>
