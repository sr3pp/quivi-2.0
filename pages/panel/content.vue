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
      @media-gallery="EmitHandler($event, component, editPicture)"
      @icon-gallery="EmitHandler($event, component, editIcon)"
      @edit-props="editComponent($event, component)"
      @add-slide="addSlide($event, component)"
      @delete-slide="deleteSlide($event, component)"
      :options="options"
      v-bind="component.props")

  // This part shows the catalog content
  template(v-if="currentCatalog.sw")
    SrContainer
      SrText(text="Catalogos" class="subtitle" alignment="center")
      SrFormSelect(:options="currentCatalog.options" v-model="currentCatalog.name" @change="setCatalog")
      br
      div.catalog-card(v-if="currentCatalog.card")
        SrPicture(:src="currentCatalog.card.thumb" alt="placeholder" :editable="true")
        div  
          SrFormInput(v-model="currentCatalog.card.label" label="Titulo")
          SrFormInput(v-model="currentCatalog.card.order" label="Orden")
        ul.catalog-card-list
          li.catalog-card-item(v-for="(item, i) in currentCatalog.card.list" :key="i")
            SrFormInput(v-model="currentCatalog.card.list[i]")
            button(@click="deleteItem(i)")
              SrIcon(name="trash-o")
          li.catalog-card-item
            button(@click="addItem")
              SrIcon(name="plus-o")
      template(v-if="currentCatalog.current")
        component(v-for="(c, i) in currentCatalog.current" :is="c.component" v-bind="c.props" :key="i"
          @media-gallery="EmitHandler($event, c, editPicture)"
          @icon-gallery="EmitHandler($event, c, editIcon)"
          @edit-props="editComponent($event, c)")

  SrModal(ref="seoModal")
    template(#body)
        SeoWizzard
  SrModal(ref="componentsModal")
    template(#body)
        p list of components here
  SrModal.media-modal(ref="mediaModal")
    template(#body)
      div(class="media-modal-container")
        SrDirectory(:directory="mediaDir.children" @change="setMediaDir" :onlyDirs="true")
        ul.media-modal-list(v-if="currentMedia")
          template(v-for="(item, i) in currentMedia.children" :key="'media-item-'+new Date().getTime() + i")
            li.media-modal-item(v-if="!item.children")
              button(@click="setPicture(`/${item.path}`)")
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
import type { Component } from "sr-content-2/types";

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

const catalogs = await $fetch("/api/catalogo");

const currentCatalog = ref({
  name: "",
  options: catalogs.map((c: any) => ({
    value: c.slug,
    name: c.label,
  })),
  sw: false,
  current: null,
  card: null,
});

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

const componentsModal: Ref<boolean> = ref(false);
const seoModal: Ref<boolean> = ref(false);
const previewModal: Ref<boolean> = ref(false);
const mediaModal: Ref<boolean> = ref(false);
const iconModal: Ref<boolean> = ref(false);
const propsModal: Ref<boolean> = ref(false);

const currentComponent: Ref<any> = ref(null);
const previewSw: Ref<boolean> = ref(false);
const responsive: Ref<string> = ref("");
const page: Ref<string> = ref("/index");
const currentPicture: Ref<any> = ref({ props: { src: "" } });
const currentIcon: Ref<any> = ref({ props: { name: "" } });
const currentMedia: Ref<any> = ref(null);
const isBackground: Ref<boolean> = ref(false);
const mediaDir = ref(await $fetch("/api/admin/get-directory?folder=img"));
const { data: media }: any = await useAsyncData("media", async () => {
  const promises = await Promise.all([
    $fetch("/api/admin/gallery?folder=slides"),
    $fetch("/api/admin/gallery?folder=catalogo"),
  ]);

  const media = {
    slides: promises[0],
    catalogo: promises[1],
  };
  return media;
});

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

onMounted(() => {
  setContent();
});

const setResolution = () => {};

const showPreview = () => {
  previewSw.value = true;
  content.value = proccessContent(content.value, false);
  (previewModal.value as any).toggle();
};

const content: any = ref([]);

const getContent = async () => {
  return await $fetch(`/api/content?page=${page.value}`);
};

const setContent = async () => {
  const _content = proccessContent(await getContent(), true);
  content.value = _content;
  if (page.value == "catalogo/index") {
    currentCatalog.value.sw = true;
  } else {
    currentCatalog.value.sw = false;
  }
};

const setCatalog = async (catalog: string) => {
  const { content, card } = await $fetch(
    `/api/content?page=catalogo/${currentCatalog.value.name}&section=content,card`,
  );

  (currentCatalog.value.current as any) = proccessContent(content, true);
  currentCatalog.value.card = card;
};

const saveContent = async () => {
  const res = await $fetch(`/api/content?page=${page.value}`, {
    method: "PUT",
    body: proccessContent(content.value, false),
  });
  proccessContent(content.value, true);
  if (currentCatalog.value.sw) {
    await $fetch(`/api/content?page=${currentCatalog.value.name as string}`, {
      method: "PUT",
      body: proccessContent(currentCatalog.value?.current || [], false),
    });
    await $fetch(
      `/api/content?page=${currentCatalog.value.name as string}&section=card`,
      {
        method: "PUT",
        body: currentCatalog.value.card,
      },
    );
  }
};

const editPicture = (picture: any) => {
  isBackground.value = false;
  currentPicture.value = picture;
  (mediaModal.value as any).toggle();
};

const editBackground = ($event: any) => {
  isBackground.value = true;
  (mediaModal.value as any).toggle();
};

const editComponent = ($event: any, _component: Component) => {
  const component = $event || _component;
  if (!("css" in component.props)) {
    component.props.css = {
      style: {},
      class: "",
    };
  } else if (!("style" in (component.props as any).css)) {
    (component.props as any).css.style = {};
  } else if (!("class" in (component.props as any).css)) {
    (component.props as any).css.class = "";
  }

  currentComponent.value = { component } || {
    component: "SrContainer",
    props: {
      withPadding: true,
      contained: true,
      content: content.value,
      css: {
        style: {},
      },
    },
  };

  (propsModal.value as any).toggle();
};

const editIcon = (icon: any) => {
  currentIcon.value = icon;
  (iconModal.value as any).toggle();
};

const setPicture = (url: string) => {
  if (isBackground.value) {
    currentComponent.value.component.props.css.style.backgroundImage = `url(${url})`;
  } else if (currentPicture.value.props) {
    currentPicture.value.props.src = url;
  } else {
    const { bg, resolution }: any = currentPicture.value;
    bg[resolution] = url;
  }
  (mediaModal.value as any).toggle();
};

const setIcon = (name: string) => {
  currentIcon.value.props.name = name;
  (iconModal.value as any).toggle();
};

const addSlide = (slide: any, component: any) => {
  component.props.slides.push(slide);
};

const deleteSlide = (idx: number, component: any) => {
  component.props.slides.splice(idx, 1);
};

const addItem = () => {
  (currentCatalog.value.card as any).list.push("New item");
};

const deleteItem = (idx: number) => {
  (currentCatalog.value.card as any).list.splice(idx, 1);
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

  .catalog-card {
    display: flex;
    align-items: center;
    gap: pxToRem(10);
    .sr-picture {
      width: pxToRem(100);
      img {
        height: 100% !important;
      }
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: pxToRem(10);
      margin-bottom: pxToRem(20);
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: pxToRem(10);
      button {
        background: none;
        border: none;
        margin-top: auto;
        margin-bottom: pxToRem(4);
      }

      .sr-icon {
        color: $color-quivi-red;
        width: pxToRem(20);
        height: pxToRem(20);
      }
    }
  }

  .sr-preview-controls-resolutions {
    display: flex;
    gap: pxToRem(10);
  }
}
</style>
