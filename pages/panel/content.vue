<template lang="pug">
.quivi-content
  SrModal(:active="previewSw"
      @close="closePreview"
      v-bind="{ css: { class: 'preview-modal' } }")
      template(#close)
        span X
      template(#header)
        div(class="sr-modal-header")
          SrContainer(:with-padding="true")
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
            v-bind="{content: proccessContent(content)}")
  .top-bar 
    SrFormSelect(:options="pagesOtions" value="nosotros/index" v-model="page" @change="setContent" placeholder="Seleccionar página")
    button(@click="contentModal = true") Edit Seo
    button(@click="componentModal = true") component list
    button(@click="saveContent") save
    button(@click="previewSw = true") Preview
  SrContainer(:with-padding="true")
    SrText(text="Panel content" class="title" alignment="center")
    component(v-for="(component, i) in content"
      :is="component.component"
      :key="i"
      @media-gallery="EmitHandler($event, component, editPicture)"
      @icon-gallery="EmitHandler($event, component, editIcon)"
      @edit-props="editComponent"
      v-bind="component.props")
    .fill
  SrModal(:active="contentModal" @close="contentModal = false")
    template(#body)
      .sr-modal-body
        SeoWizzard
  SrModal(:active="componentModal" @close="componentModal = false")
    template(#body)
      .sr-modal-body
        p list of components here
  SrModal(:active="mediaGallery" @close="mediaGallery = false")
    template(#body)
      .sr-modal-body
        button
          SrPicture(src="https://via.placeholder.com/400" alt="placeholder" @click="setPicture('https://via.placeholder.com/400')")
  SrModal(:active="iconGallery" @close="iconGallery = false")
    template(#body)
      .sr-modal-body
        button
          SrIcon(name="edit-o" @click="setIcon('edit-o')")


  SrModal(class="component-props-modal"
      :active="propsSw"
      @close="propsSw = false"
      layout="bottom")
      template(#close)
        span X
      template(#body)
        div(class="sr-modal-body" v-if="currentComponent")
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
            :container-element="currentComponent.component.props")
          SrTabsPropsForm(:responsive="responsive"
            v-if="currentComponent.component.component == 'SrTabs'"
            :tabs-element="currentComponent.component.props")
</template>

<script lang="ts" setup>
import { proccessContent, EmitHandler } from "sr-content-2/assets/ts/utilities";
import SliderMain from "@/components/Slider/Main.vue";
import type { Component } from "sr-content-2/types";

const Components = {
  SliderMain,
};
definePageMeta({
  layout: "panel",
});

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

const contentModal: Ref<boolean> = ref(false);
const componentModal: Ref<boolean> = ref(false);
const currentComponent: Ref<any> = ref(null);
const mediaGallery: Ref<boolean> = ref(false);
const iconGallery: Ref<boolean> = ref(false);
const previewSw: Ref<boolean> = ref(false);
const propsSw: Ref<boolean> = ref(false);
const responsive: Ref<string> = ref("");
const page: Ref<string> = ref("nosotros/index");
const currentPicture: Ref<any> = ref({ props: { src: "" } });
const currentIcon: Ref<any> = ref({ props: { name: "" } });

const pagesOtions = [
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

const closePreview = () => {
  previewSw.value = false;
};

const content: any = ref([]);

const getContent = async () => {
  return await $fetch(`/api/content?page=${page.value}`);
};

const setContent = async () => {
  const _content = proccessContent(await getContent(), true);
  content.value = _content;
};

const saveContent = () => {
  console.log(content.value);
};

const editPicture = (picture: any) => {
  currentPicture.value = picture;
  mediaGallery.value = true;
};

const editComponent = (component: Component) => {
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

  propsSw.value = true;
};

const editIcon = (icon: any) => {
  currentIcon.value = icon;
  iconGallery.value = true;
};

const setPicture = (url: string) => {
  if (currentPicture.value.props) {
    currentPicture.value.props.src = url;
  } else {
    const { bg, resolution }: any = currentPicture.value;
    console.log(bg, resolution);
    bg[resolution] = url;
  }
  mediaGallery.value = false;
};

const setIcon = (name: string) => {
  currentIcon.value.props.name = name;
  iconGallery.value = false;
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
    }
  }

  .fill {
    height: 110vh;
  }
}
</style>
