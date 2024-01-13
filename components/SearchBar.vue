<template lang="pug">
.quivi-searchbar
    input(type="text" placeholder="Buscar" v-model="search" @input="runSearch")
    button.quivi-searchbar-clearbtn(v-if="results.length" @click="results = []")
      span x
    button(@click="goToSearch")
        SrIcon(name="lupa-o")
    .quivi-searchbar-results-container(:class="{ active: results.length > 0 }")
      ul.quivi-searchbar-results
        li.quivi-searchbar-result(v-for="(result, i) in results" :key="i")
          NuxtLink(:to="result.url" :prefetch="false")
            SrPicture(:src="`/products/${result.web}/${result.thumbs[0]}`" :alt="result.name")
            .quivi-searchbar-result-description
              SrText(:text="result.name" class="subtitle")
              SrText(:text="result.brand.name")
              SrText.small(:text="result.web")
      .quivi-searchbar-result.full
          NuxtLink(:to="`/?search=${search}`") Ver todos los resultados
</template>

<script lang="ts" setup>
import type { Product } from "~/types";

const props = defineProps({
  endpoint: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["search"]);

let controller: null | AbortController = null;
const search: Ref<String> = ref("");
const results: Ref<Array<Product>> = ref([]);

const runSearch = async () => {
  if (controller) {
    controller.abort();
  }

  if (!search.value) {
    results.value = [];
    return;
  } else if (search.value.length < 3) {
    return;
  }

  controller = new AbortController();
  const signal = controller.signal;
  if (props.endpoint) {
    results.value = [];
    const { data: _results }: any = await useFetch(props.endpoint, {
      method: "POST",
      body: {
        search,
      },
      signal,
    });

    results.value = _results.value.products;

    emit("search", _results);
  }
};
const router = useRouter();
const goToSearch = () => {
  if (search.value) {
    router.push({ path: "/", query: { search: search.value as string } });
  }
};

const route = useRoute();

watch(
  () => route.path,
  () => {
    results.value = [];
    search.value = "";
  },
);

watch(
  () => route.query,
  () => {
    results.value = [];
    search.value = "";
  },
);
</script>

<style lang="scss" scoped>
.quivi-searchbar {
  display: flex;
  position: relative;
  border: {
    style: solid;
    color: $color-quivi-gray;
    width: pxToRem(1);
    radius: pxToRem(8);
  }

  height: pxToRem(50);

  input {
    width: 100%;
    border: none;
    border-radius: pxToRem(8);
    background-color: $color-white;
    padding: pxToRem(8);
    padding-right: pxToRem(60);
    font-size: pxToRem(16);
  }

  button {
    cursor: pointer;
    padding: pxToRem(4);
    background-color: $color-quivi-red;
    color: $color-white;
    border: none;
    border-top-right-radius: pxToRem(8);
    border-bottom-right-radius: pxToRem(8);
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: pxToRem(40);
    display: flex;
    align-items: center;
    justify-content: center;

    .sr-icon {
      flex-shrink: 0;
      width: pxToRem(25);
      height: pxToRem(25);
    }
  }

  &-results-container {
    max-height: 0;
    opacity: 0;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 2;
    top: 100%;
    left: 0;
    width: 100%;
    border-bottom-left-radius: pxToRem(8);
    border-bottom-right-radius: pxToRem(8);
    overflow: hidden;
    border: {
      style: solid;
      color: rgba($color-quivi-dark-gray, 0.3);
      width: pxToRem(1);
    }
    border-top: none;
    background-color: $color-white;
    box-shadow: pxToRem(0) pxToRem(4) pxToRem(20)
      rgba($color-quivi-dark-gray, 0.3);
    transition:
      max-height 0.35s ease-in-out,
      opacity 0.35s ease;

    &.active {
      max-height: pxToRem(300);
      opacity: 1;
    }
  }

  &-results {
    height: 100%;
    overflow: auto;
    padding-bottom: pxToRem(50);
  }

  &-result {
    a {
      display: flex;
      padding: pxToRem(8);
      color: $color-text-color;

      .sr-img {
        width: 25%;
        margin-right: pxToRem(20);
      }
    }

    &-description {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &.full {
      background-color: $color-white;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: pxToRem(40);
      box-shadow: pxToRem(0) pxToRem(-4) pxToRem(10)
        rgba($color-quivi-dark-gray, 0.1);
      a {
        width: 100%;
        justify-content: center;
        color: $color-quivi-green;
      }
    }
  }

  &-clearbtn {
    position: absolute;
    right: pxToRem(40) !important;
    top: 0;
    background: none !important;
    color: $color-quivi-gray !important;
    font-size: pxToRem(18);
    font-family: Bebas;
  }
}
</style>
