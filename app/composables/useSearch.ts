export function useSearch(endpoint: string) {
  const query: Ref<string> = ref("");
  const results: Ref<any> = ref({});

  const doSearch = async () => {
    if (query.value.length < 3) {
      results.value = {};
      return;
    }
    const _results = await $fetch(endpoint, {
      method: "POST",
      body: {
        search: query.value,
      },
    });
    results.value = _results as any;
  };

  return { results, query, doSearch };
}
