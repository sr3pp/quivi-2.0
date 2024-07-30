<template lang="pug">
.quivi-content
  SrModal(ref="previewModal" @toggled="previewSw = $event"
      v-bind="{ css: { class: 'preview-modal' } }")
      template(#close)
        span X
      template(#header)
        div(class="sr-modal-header")
          SrContainer
            h2 Preview
            ul(class="sr-preview-controls-resolutions")
              li(class="sr-preview-controls-resolution"
                v-for="(br, i) in breakpoints"
                :key="i")
                SrFormBox(:label="br.name"
                  type="radio"
                  name="responsive"
                  :value="br.value"
                  v-model="responsive")
      template(#body)
        div(class="sr-modal-body")
          SrPreview(v-if="previewSw"
            :responsive="responsive"
            :app-components="Components"
            prefix="Sr"
            v-bind="{content}")
  .top-bar 
    SrFormSelect(:options="pagesOtions" value="/index" v-model="page" @change="setContent" placeholder="Seleccionar página")
    button(@click="seoModal.toggle()") Edit Seo
    button(@click="componentsModal.toggle()") component list
    button(@click="saveContent") save
    button(@click="showPreview") Preview
  SrContainer(:with-padding="true")
    SrText(text="Panel content" class="title" alignment="center")
    component(v-for="(component, i) in content"
      :is="component.component"
      :key="i"
      @media-gallery="EmitHandler($event, component, (data) => editPicture(data, mediaModal.toggle))"
      @icon-gallery="EmitHandler($event, component, editIcon)"
      @edit-props="editComponent($event, component, propsModal.toggle)"
      @add-slide="component.props.slides.push($event)"
      @delete-slide="component.props.slides.splice($event, 1)"
      @component-list="editComponent($event.component, component, componentsModal.toggle)"
      :options="options"
      v-bind="component.props")

  // This part shows the catalog content
  template(v-if="currentCatalog")
    SrContainer
      SrText(text="Catalogos" class="subtitle" alignment="center")
      CatalogList(
        @set-catalog="currentCatalog = $event"
        :catalogs="catalogs"
        @delete-catalog="catalogs.splice(catalogs.findIndex((c: any) => c.slug == $event), 1)")
      br
      CatalogDetail(
        :catalog="currentCatalog"
        @media-modal="mediaModal.toggle()"
        @highlight-product="highlightProduct"
        @edit-props="propsModal.toggle"
        @component-gallery="componentsModal.toggle()"
        )

  SrModal(ref="seoModal")
    template(#body)
        SeoWizzard
  SrModal(ref="componentsModal")
    template(#body)
        button(@click="() => insertComponent(componentsModal.toggle)") clickmme
  ClientOnly
    SrModal.media-modal(ref="mediaModal")
      template(#body)
        div(class="media-modal-container" v-if="mediaDir")
          SrDirectory(:directory="mediaDir.children" @change="setMediaDir" :onlyDirs="true")
          ul.media-modal-list(v-if="currentMedia")
            template(v-for="(item, i) in currentMedia.children" :key="'media-item-'+new Date().getTime() + i")
              li.media-modal-item(v-if="!item.children")
                button(@click="setPicture(`/${item.path}`, mediaModal.toggle)")
                  SrPicture(:src="`/${item.path}`" alt="placeholder")
  SrModal(ref="iconModal")
    template(#body)
        button
          SrIcon(name="edit-o" @click="setIcon('edit-o')")


  SrModal(class="component-props-modal"
      ref="propsModal"
      layout="bottom")
      template(#close)
        span X
      template(#body)
        template(v-if="currentComponent")
          SrTextPropsForm(:responsive="responsive"
            @clear-breakpoint="clearBreakpoint"
            v-if="currentComponent.component.component == 'SrText'"
            :text-element="currentComponent.component.props")
          SrGridPropsForm(:responsive="responsive"
            v-if="currentComponent.component.component == 'SrGrid'"
            :grid-element="currentComponent.component.props")
          SrGridColumnPropsForm(:responsive="responsive"
            v-if="currentComponent.component.component == 'SrGridColumn'"
            :column-element="currentComponent.component.props")
          SrContainerPropsForm(:responsive="responsive"
            v-if="currentComponent.component.component == 'SrContainer'"
            :container-element="currentComponent.component.props"
            @media-gallery="EmitHandler($event, currentComponent.component, editBackground)")
          SrTabsPropsForm(:responsive="responsive"
            v-if="currentComponent.component.component == 'SrTabs'"
            :tabs-element="currentComponent.component.props")
</template>

<script lang="ts" setup>
import { proccessContent, EmitHandler } from "sr-content-2/assets/ts/utilities";
import * as SrComponents from "sr-content-2/components";
import SliderMain from "@/components/Slider/Main.vue";

const appComponents = {
  SliderMain,
};

const prefixedComponents: any = {};
Object.keys(SrComponents).forEach((componentName) => {
  prefixedComponents[`Sr${componentName}`] = (SrComponents as any)[
    componentName
  ];
});

const Components = {
  ...prefixedComponents,
  ...appComponents,
};

const currentCatalog: any = ref(null);

definePageMeta({
  layout: "panel",
});

const options = {
  pagination: true,
  navigation: true,
  creative: {
    prev: {
      shadow: false,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
  },
};

const breakpoints = [
  {
    name: "Mobile",
    value: "",
  },
  {
    name: "Portrait",
    value: "-sm",
  },
  {
    name: "Landscape",
    value: "-md",
  },
  {
    name: "Desktop",
    value: "-lg",
  },
  {
    name: "Large Desktop",
    value: "-xl",
  },
];

const content: any = ref([]);
const componentsModal: Ref<HTMLElement | null> = ref(null);
const seoModal: Ref<boolean> = ref(false);
const previewModal: Ref<boolean> = ref(false);
const mediaModal: Ref<boolean> = ref(false);
const iconModal: Ref<boolean> = ref(false);
const propsModal: Ref<boolean> = ref(false);

const previewSw: Ref<boolean> = ref(false);
const responsive: Ref<string> = ref("");
const page: Ref<string> = ref("/index");
const currentIcon: Ref<any> = ref({ props: { name: "" } });
const currentMedia: Ref<any> = ref(null);
const { data } = await useAsyncData<any>(async () => {
  const promises = await Promise.all([
    $fetch("/api/admin/gallery?folder=slides"),
    $fetch("/api/admin/gallery?folder=catalogo"),
    $fetch("/api/admin/get-directory?folder=img"),
    $fetch("/api/catalogo"),
  ]);

  const mediaDir = promises[2];
  const media = {
    slides: promises[0],
    catalogo: promises[1],
  };
  return { mediaDir, media, catalogs: promises[3] };
});

const { mediaDir, media } = data.value;
const catalogs = ref(data.value.catalogs);
const pagesOtions = [
  {
    value: "/index",
    name: "Home",
  },
  {
    value: "nosotros/index",
    name: "Nosotros",
  },
  {
    value: "catalogo/index",
    name: "Catalogo",
  },
];

const { setPicture, editPicture, isBackground } = usePicture();
const { editComponent, currentComponent, insertComponent } =
  useComponent(content);

onMounted(() => {
  setContent();
});

const setResolution = () => {};

const showPreview = () => {
  previewSw.value = true;
  content.value = proccessContent(content.value, false);
  (previewModal.value as any).toggle();
};

const getContent = async () => {
  return await $fetch(`/api/content?page=${page.value}`);
};

const setContent = async () => {
  const _content = proccessContent(await getContent(), true);
  content.value = _content;
  if (page.value == "catalogo/index") {
    currentCatalog.value = catalogs.value[0];
  } else {
    currentCatalog.value = null;
  }
};

const saveContent = async () => {
  if (currentCatalog.value.isNew) {
    if (!currentCatalog.value.card.label || !currentCatalog.value.brand) return;
    currentCatalog.value.card.slug = currentCatalog.value.card.label
      .toLowerCase()
      .replace(/ /g, "_");

    proccessContent(currentCatalog.value.content, false);
    await $fetch(
      `/api/content?page=catalogo/${currentCatalog.value.card.slug}`,
      {
        method: "POST",
        body: currentCatalog.value,
      },
    );
    catalogs.value.push(currentCatalog.value.card);
    currentCatalog.value.isNew = false;
    return;
  }

  await $fetch(`/api/content?page=${page.value}`, {
    method: "PUT",
    body: proccessContent(content.value, false),
  });
  proccessContent(content.value, true);
  if (currentCatalog.value.sw) {
    await $fetch(
      `/api/content?page=catalogo/${currentCatalog.value.card.slug}&section=all`,
      {
        method: "PUT",
        body: currentCatalog.value,
      },
    );
  }
};

const editBackground = ($event: any) => {
  isBackground.value = true;
  (mediaModal.value as any).toggle();
};

const editIcon = (icon: any) => {
  currentIcon.value = icon;
  (iconModal.value as any).toggle();
};

const setIcon = (name: string) => {
  currentIcon.value.props.name = name;
  (iconModal.value as any).toggle();
};

const setMediaDir = (item: any) => {
  currentMedia.value = item;
};

const clearBreakpoint = (resolution: string) => {
  Object.keys(
    (currentComponent as any).value.component.props.css.style,
  ).forEach((key: string) => {
    if (key.includes(resolution)) {
      delete (currentComponent as any).value.component.props.css.style[key];
    }
  });
};

const highlightProduct = (product: any) => {
  if (currentCatalog.value.products.includes(product.web)) {
    currentCatalog.value.products = currentCatalog.value.products.filter(
      (p: any) => p != product.web,
    );
  } else {
    currentCatalog.value.products.push(product.web);
  }
};

watch(previewSw, () => {
  if (!previewSw.value) {
    proccessContent(content.value, true);
  }
});
</script>

<style lang="scss" scoped>
.quivi-content {
  .top-bar {
    background-color: $color-quivi-darkest-red;
    color: $color-white;
    padding: pxToRem(8);
    display: flex;
    align-items: center;
    position: sticky;
    gap: pxToRem(20);
    z-index: 2;
    top: 0;

    .sr-form-select {
      width: pxToRem(200);
      --input-border-color: #{$color-white};
      --input-color: #{$color-white};

      option {
        color: $color-black;
      }
    }
  }

  .fill {
    height: 110vh;
  }

  .sr-modal {
    &-header {
      padding: pxToRem(20);
    }

    &-body {
      height: 65vh;
      .media-modal-list {
        display: flex;
        flex-wrap: wrap;
        gap: pxToRem(10);
      }
      .media-modal-item {
        width: calc((100% - pxToRem(40)) / 4);
      }

      .media-modal-container {
        display: flex;
        gap: pxToRem(10);
      }
    }
  }

  .sr-preview-controls-resolutions {
    display: flex;
    gap: pxToRem(10);
  }
}
</style>
