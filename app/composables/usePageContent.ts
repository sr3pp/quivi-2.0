export async function usePageContent(path: string) {
  const { data: page } = await useAsyncData(path, async () => {
    const data = await queryCollection("pages").path(path).first();
    return data;
  });

  return {
    page,
  };
}
