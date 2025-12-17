<script setup lang="ts">
const props = defineProps<{
  files: any;
  catalogName: string;
}>();

const emit = defineEmits<{
  (
    event: "removeFile",
    payload: { key: string; file: string; idx: number },
  ): void;
  (event: "addFile", payload: { key: string; files: string[] }): void;
}>();

const handleFileChange = async (event: Event, type: string) => {
  const files: FileList | null = (event.target as HTMLInputElement).files;

  const formData = new FormData();
  Array.from(files as FileList).forEach((file: File, i: number) => {
    formData.append(`file${i}`, file);
  });
  formData.append("url", `downloads/catalogo/${props.catalogName}/${type}`);

  await $fetch(`/api/admin/files`, {
    method: "POST",
    body: formData,
  });
  emit("addFile", {
    key: type,
    files: Array.from(files as FileList).map((file) => file.name),
  });
};

const handleDeleteFile = async (key: string, file: string, idx: number) => {
  if (!confirm("¿Estás seguro de que deseas eliminar este archivo?")) return;
  const fileUrl = `downloads/catalogo/${props.catalogName}/${key}/${file}`;
  await $fetch(`/api/admin/files`, {
    method: "DELETE",
    body: { file: fileUrl },
  });
  emit("removeFile", { key, file, idx });
};
</script>

<template lang="pug">
.catalog-files
  template(v-for="section in ['catalogos', 'fichas tecnicas', 'garantias', 'extras']")
    div.catalog-files-section
      SrText(:text="section" class="subtitle")
      ul.catalog-files-list
        li.catalog-files-list-item(v-for="file in files[section]" :key="file.name")
          span {{ file }}
          button(@click="handleDeleteFile(section, file)")
            SrIcon(name="trash-o")
        li.catalog-files-list-item.new
          label
            input(type="file" accept=".pdf" @change="handleFileChange($event, section)" multiple)
            SrIcon(name="plus-o")
</template>

<style lang="scss" scoped>
.catalog-files {
  display: flex;

  &-section {
    display: flex;
    flex-direction: column;
    padding: pxToRem(8);
    flex-basis: 25%;
    width: 25%;
  }

  &-list {
    height: 100%;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: pxToRem(16);

    &-item.new {
      margin-top: auto;
      position: relative;
      cursor: pointer;
      label {
        display: flex;
        width: 100%;
        align-items: center;
        gap: pxToRem(8);
        background-color: transparent;
        border: none;
        cursor: pointer;
        input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
    &-item {
      display: flex;
      align-items: center;
      gap: pxToRem(8);
      span {
        word-break: break-all;
      }
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
      }
      .sr-icon {
        color: $color-quivi-red;
        width: pxToRem(24);
        height: pxToRem(24);
        margin: auto;
      }
    }
  }
}
</style>
