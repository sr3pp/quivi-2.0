<template lang="pug">
.catalogo
    ContentRenderer(v-if="page?.body" :value="page")

    SrContainer(:with-padding="true")
        SrGrid
          SrGridColumn(class="catalogo-item col-span-12 sm:col-span-6 flex gap-2" v-for="(item, i) in catalogo" :key="i")
            NuxtLink.w-full(:to="`/catalogo/${item.slug}`")
              SrPicture(:src="item.thumb" :alt="item.label" class="catalogo-banner")
              div.catalogo-item-description
                SrText(:text="item.label" class="title")
                ol.catalogo-item-description-list
                  li.catalogo-item-description-list-item(v-for="(el, i) in item.list" :key="i")
                    SrIcon(name="quivi-check-o")
                    SrText(:text="el")
    SrContainer(:with-padding="true")
      SrGrid.catalogo-brands(tag="ul" style="--justify-content: center;")
        SrGridColumn(class="col-span-12")
          SrText(:html="ourBrandsLabel" class="subtitle")
        SrGridColumn.catalogo-brands-item(v-for="(brand, i) in productBrands" tag="li" class="col-span-12 sm:col-span-6" :key="i")
          SrPicture(:src="brand.logo" :alt="brand.nombre")
        
      SrText.and-more(text="Y muchos más..." style="--text-align: center;")
    
</template>

<script lang="ts" setup>
const route = useRoute();
const [catalogo, { page }] = await Promise.all([
  $fetch("/api/catalogo"),
  usePageContent(route.path),
]);

const productBrands = computed(() => page.value?.brands ?? []);

const ourBrandsLabel =
  "Conoce Todas <span class='text-quivi-light-red font-bold'>Nuestras Marcas</span>";
</script>

<style lang="scss" scoped>
.catalogo {
  &-item {
    align-items: center;

    a {
      display: flex;
      color: $color-text-color;
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

  &-banner {
    width: 40% !important;
    border-radius: pxToRem(20);
    margin-right: pxToRem(10);
    overflow: hidden;
  }

  &-brands {
    margin-bottom: pxToRem(20);

    [class*="sr-grid-col"] {
      display: flex;
      justify-content: center;
      padding: pxToRem(20);

      &:first-child {
        padding: 0;
      }

      .sr-text {
        &.subtitle {
          font-family: inria !important;
        }
      }
    }
  }

  .and-more {
    color: $color-quivi-green;
    font-size: pxToRem(20);
  }
}
</style>
