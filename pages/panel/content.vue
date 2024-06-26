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
      @edit-props="editComponent"
      @add-slide="addSlide($event, component)"
      :options="options"
      v-bind="component.props")
  SrModal(ref="seoModal")
    template(#body)
        SeoWizzard
  SrModal(ref="componentsModal")
    template(#body)
        p list of components here
  SrModal(ref="mediaModal")
    template(#body)
        button
          SrPicture(src="https://via.placeholder.com/1100x322" alt="placeholder" @click="setPicture('https://via.placeholder.com/1100x322')")
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
            :container-element="currentComponent.component.props")
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

const pagesOtions = [
  {
    value: "/index",
    name: "Tienda",
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
};

const saveContent = async () => {
  const res = await $fetch(`/api/content?page=${page.value}`, {
    method: "PUT",
    body: content.value,
  });
  console.log(res);
};

const editPicture = (picture: any) => {
  currentPicture.value = picture;
  (mediaModal.value as any).toggle();
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

  (propsModal.value as any).toggle();
};

const editIcon = (icon: any) => {
  currentIcon.value = icon;
  (iconModal.value as any).toggle();
};

const setPicture = (url: string) => {
  if (currentPicture.value.props) {
    currentPicture.value.props.src = url;
  } else {
    const { bg, resolution }: any = currentPicture.value;
    console.log(bg, resolution);
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
    }
  }

  .sr-preview-controls-resolutions {
    display: flex;
    gap: pxToRem(10);
  }
}
</style>
