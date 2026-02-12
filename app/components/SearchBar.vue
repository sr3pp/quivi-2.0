<template lang="pug">
div(class="relative flex h-[50px] w-full rounded-lg border border-[var(--color-quivi-gray)] bg-[var(--color-white)]")
  UInput(
    type="text"
    placeholder="Buscar"
    v-model="search"
    @input="runSearch"
    class="h-full w-full"
    :ui="{ base: 'h-full rounded-lg border-none bg-transparent px-2 pr-[60px] text-base text-[var(--color-text-color)] ring-0 focus:ring-0' }"
  )
  button(
    v-if="results.length"
    @click="results = []"
    class="absolute right-10 top-0 z-[3] flex h-full w-8 items-center justify-center bg-transparent text-[18px] font-bebas text-[var(--color-quivi-gray)]"
    aria-label="Limpiar resultados"
  )
    span x
  button(
    class="absolute right-0 top-0 z-[4] flex h-full w-10 items-center justify-center rounded-r-md border-0 bg-[var(--color-quivi-red)] p-2 text-[var(--color-white)]"
    @click="goToSearch"
    aria-label="Buscar"
  )
    SvgIcon(class="size-4 text-[var(--color-white)]" name="lupa-o")
  div(
    class="absolute left-0 top-full z-[2] flex w-full flex-col overflow-hidden rounded-b-lg border border-t-0 border-[rgba(91,91,95,0.3)] bg-[var(--color-white)] opacity-0 shadow-[0_4px_20px_rgba(91,91,95,0.3)] transition-[max-height,opacity] duration-300 ease-in-out"
    :class="results.length ? 'max-h-[300px] opacity-100' : 'max-h-0'"
  )
    ul(class="h-full overflow-auto pb-[50px]")
      li(v-for="(result, i) in results" :key="i")
        NuxtLink(
          :to="result.url"
          :prefetch="false"
          class="flex p-2 text-[var(--color-text-color)]"
        )
          NuxtImg(
            :src="`/products/${result.web}/${result.thumbs[0]}`"
            :alt="result.name"
            class="mr-5 w-1/4"
          )
          div(class="flex flex-col justify-center")
            p {{ result.name }}
            p {{ result.brand.name }}
            p {{ result.web }}
    div(class="absolute bottom-0 left-0 h-10 w-full bg-[var(--color-white)] shadow-[0_-4px_10px_rgba(91,91,95,0.1)]")
      NuxtLink(
        :to="`/tienda?search=${search}`"
        class="flex h-full w-full items-center justify-center text-[var(--color-quivi-green)]"
      ) Ver todos los resultados
</template>

<script lang="ts" setup>
import type { Product } from "~/types";

interface SearchResultsResponse {
  products: Product[];
}

const props = defineProps({
  endpoint: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  search: [results: SearchResultsResponse | null];
}>();

let controller: AbortController | null = null;
const search = ref("");
const results = ref<Product[]>([]);

const runSearch = async () => {
  if (controller) {
    controller.abort();
  }

  if (!search.value) {
    results.value = [];
    return;
  }

  if (search.value.length < 3) {
    return;
  }

  controller = new AbortController();

  if (!props.endpoint) {
    return;
  }

  results.value = [];
  const { data: fetchResults } = await useFetch<SearchResultsResponse>(
    props.endpoint,
    {
      method: "POST",
      body: {
        search: search.value,
      },
      signal: controller.signal,
    },
  );

  const payload = fetchResults.value ?? null;
  results.value = payload?.products ?? [];
  emit("search", payload);
};

const router = useRouter();
const goToSearch = () => {
  if (search.value) {
    router.push({ path: "/tienda", query: { search: search.value } });
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
