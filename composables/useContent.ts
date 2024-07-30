export function useContent() {
  const content = ref<any>(null);
  const loading = ref<boolean>(false);

  return { content, loading };
}
