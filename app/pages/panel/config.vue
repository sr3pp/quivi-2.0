<template lang="pug">
.quivi-config
  SrContainer(:with-padding="true")
    SrGrid.quivi-config-header
      SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
        SrText(text="Panel Config" class="title")
      SrGridColumn(:size="{mobile: '1', sm: '1/2'}")
        QuiviButton(@click="updateConfig" class="sr-button--primary" variant="secondary" label="Guardar cambios")
    div
      SrText(text="Envio" class="subtitle")
      SrGrid(tag="ul")
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/2', md: '1/4'}" v-for="(value, key) in shipping" :key="key")
          SrFormInput(v-model="shipping[key]" :label="key" :disabled="key === 'clave'" type="text")
    div  
      SrText(text="Comercios" class="subtitle")
      SrGrid(tag="ul")
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/2', md: '1/4'}" v-for="(value, key) in comercios" :key="key")
          SrPicture(:src="`${value.logo}`" :alt="value.name" :editable="true" @media-gallery="showGallery(comercios[key], 'logo')")
          SrFormInput(v-model="comercios[key].name" label="Nombre" type="text")
          button(@click="comercios.splice(key, 1)") Eliminar
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/3', md: '1/5'}" key="key_distribuidor")
          SrPicture(:src="newComercio.logo" :alt="newComercio.name" :editable="true" @media-gallery="showGallery(null, 'logo', 'comercios')")
          SrFormInput(v-model="newComercio.name" label="Nombre" type="text")
          QuiviButton(@click="addElement('comercios')" label="Agregar" variant="secondary")
    div
      SrText(text="Distribuidores" class="subtitle")
      SrGrid(tag="ul" class="distribuidores")
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/3', md: '1/5'}" v-for="(value, key) in distribuidores" :key="key")
          SrPicture(:src="`${value.logo}`" :alt="value.name" :editable="true" @media-gallery="showGallery(distribuidores[key], 'logo')")
          SrFormInput(v-model="distribuidores[key].name" label="Nombre" type="text")
          button(@click="distribuidores.splice(key, 1)") Eliminar
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/3', md: '1/5'}" key="key_distribuidor")
          SrPicture(:src="newDistribuidor.logo" :alt="newDistribuidor.name" :editable="true" @media-gallery="showGallery(null, 'logo', 'distribuidores')")
          SrFormInput(v-model="newDistribuidor.name" label="Nombre" type="text")
          QuiviButton(@click="addElement('distribuidores')" label="Agregar" variant="secondary")
    div
      SrText(text="Cupones" class="subtitle")
      SrGrid(tag="ul")
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/3', md: '1/5'}" v-for="(value, key) in promotions" :key="key")
          SrFormInput(v-model="promotions[key].name" label="Nombre" type="text")
          SrFormInput(v-model="promotions[key].code" label="Codigo" type="text")
          SrFormSelect(v-model="promotions[key].category" :options="promotionOptions" label="categoria" type="text")
          button(@click="promotions.splice(key, 1)") Eliminar
        SrGridColumn(tag="li" :size="{mobile: '1', sm: '1/3', md: '1/5'}" key="key_distribuidor")
          SrFormInput(v-model="newPromotion.name" label="Nombre" type="text")
          SrFormInput(v-model="newPromotion.code" label="Codigo" type="text")
          SrFormSelect(v-model="newPromotion.category" :options="promotionOptions" label="categoria" type="text")
          QuiviButton(@click="addElement('promotions')" label="Agregar" variant="secondary")
  QuiviGallery(:gallery="gallery" ref="galleryModal" @setPicture="setGallery")
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});
const galleryModal = ref(null);
const tmpPicture: any = ref(null);
const newDistribuidor: any = ref({
  name: "",
  logo: "",
  key: "",
});
const newComercio: any = ref({
  name: "",
  logo: "",
  key: "",
});
const newPromotion: any = ref({
  name: "",
  code: "",
  category: "",
  options: [],
  key: "",
});
const [
  gallery,
  { data: comercios },
  { data: distribuidores },
  { data: promotions },
  { data: shipping },
]: any = await Promise.all([
  $fetch("/api/admin/gallery"),
  useFetch("/api/content?page=_config/comercios"),
  useFetch("/api/content?page=_config/distribuidores"),
  useFetch("/api/content?page=_config/promotions"),
  useFetch("/api/content?page=_config/shipping"),
]);

const promotionOptions = [
  {
    name: "Cupon",
    value: "cupon",
  },
  {
    name: "2x1",
    value: "2x1",
  },
  {
    name: "MSI",
    value: "msi",
  },
];

const updateConfig = async () => {
  try {
    await Promise.all([
      $fetch("/api/content?page=_config/comercios", {
        method: "PUT",
        body: comercios.value,
      }),
      $fetch("/api/content?page=_config/distribuidores", {
        method: "PUT",
        body: distribuidores.value,
      }),
      $fetch("/api/content?page=_config/promotions", {
        method: "PUT",
        body: promotions.value,
      }),
      $fetch("/api/content?page=_config/shipping", {
        method: "PUT",
        body: shipping.value,
      }),
    ]);
  } catch (error) {
    console.error(error);
  }
};

const showGallery = (picture: any, key: string, objName?: string) => {
  newComercio.value.key = "";
  newDistribuidor.value.key = "";
  if (picture) {
    tmpPicture.value = picture;
    tmpPicture.value.key = key;
  } else if (objName) {
    if (objName === "comercios") {
      newComercio.value.key = key;
    } else if (objName === "distribuidores") {
      newDistribuidor.value.key = key;
    }
  }
  (galleryModal.value as any).refEl.toggle();
};

const setGallery = (picture: any) => {
  if (tmpPicture.value) {
    tmpPicture.value[tmpPicture.value.key] = picture;
  } else if (newComercio.value.key) {
    newComercio.value[newComercio.value.key] = picture;
  } else if (newDistribuidor.value.key) {
    newDistribuidor.value[newDistribuidor.value.key] = picture;
  }
  (galleryModal.value as any).refEl.toggle();
};

const addElement = async (type: string) => {
  if (type === "distribuidores") {
    delete newDistribuidor.value.key;
    distribuidores.value.push({ ...newDistribuidor.value });
    newDistribuidor.value = { name: "", logo: "", key: "" };
  } else if (type === "comercios") {
    delete newComercio.value.key;
    comercios.value.push({ ...newComercio.value });
    newComercio.value = { name: "", logo: "", key: "" };
  } else if (type === "promotions") {
    delete newPromotion.value.key;
    promotions.value.push({ ...newPromotion.value });
    if (newPromotion.value.category === "cupon") {
      delete newPromotion.value.options;
    }
    if (newPromotion.value.category === "2x1") {
      delete newPromotion.value.percent;
      delete newPromotion.value.options;
    }
    if (newPromotion.value.category === "msi") {
      delete newPromotion.value.percent;
    }
    newPromotion.value = { name: "", code: "", category: "", key: "" };
  }
};
</script>

<style lang="scss" scoped>
.quivi-config {
  .sr-container {
    > * {
      &:not(:last-child) {
        margin-bottom: pxToRem(40);
      }
    }
  }
  .sr-grid:not(.quivi-config-header) {
    [class*="sr-grid-col"] {
      justify-content: space-between;

      .quivi-button {
        margin-top: pxToRem(10);
        min-width: 100%;
      }
    }
  }
}
</style>
