export async function usePageContent(
  path: string,
  collection: "pages" | "config" = "pages",
) {
  const { data: page } = await useAsyncData(path, async () => {
    if (collection === "config") {
      const data = await queryCollection(collection)
        .where("stem", "=", path)
        .first();
      return data;
    }
    const data = await queryCollection(collection).path(path).first();
    return data;
  });

  return {
    page,
  };
}
