<template lang="pug">
Swiper.main-slider(
    :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination, SwiperNavigation]"
    :creative-effect="options.creative"
    v-bind="options"
)
    SwiperSlide.main-slider-slide(v-for="(slide, i) in slides" :key="i")
        button.main-slider-slide-options(v-if="editable" @click="slideSettings(slide)") Configurar slide
        .main-slider-slide-background
            SrPicture(:src="slide.background.mobile" :alt="slide.title" v-if="slide.background")
        SrContainer(:with-padding="true")
            SrText(:text="slide.title" @edit-props="($event, e) => $emit('edit-props', $event || e)" class="title" style="--text-align: center;" @input="updateSlide('title', i, $event)")
            SrText(:text="slide.description" @edit-props="($event, e) => $emit('edit-props', $event || e)" style="--text-align: center;" @input="updateSlide('description', i, $event)")
            NuxtLink.main-slider-slide-link(:to="slide.link.url") {{ slide.link.label }}
SrModal(ref="slideModal")
  template(#body)
      .main-slider-slide-form-resolution(v-if="currentSlide")
        SrFormBox(type="radio" name="resolution" label="Mobile" value="mobile" v-model="currentResolution")
        SrFormBox(type="radio" name="resolution" label="Tablet" value="sm" v-model="currentResolution")
        SrFormBox(type="radio" name="resolution" label="landscape" value="md" v-model="currentResolution")
        SrFormBox(type="radio" name="resolution" label="Desktop" value="lg" v-model="currentResolution")
        SrFormBox(type="radio" name="resolution" label="Large Desktop" value="xl" v-model="currentResolution")
      
      button(@click="$emit('media-gallery', {bg: currentSlide.background, resolution: currentResolution})" v-if="currentSlide")
        SrPicture(:src="currentSlide.background ? currentSlide.background[currentResolution] : null" alt="background")

      SrFormInput(v-if="currentSlide" label="Slide Video" v-model="currentSlide.video.url" @input="updateSlide('video.url', i, $event)")

      .main-slider-slide-form(v-if="currentSlide")
        .main-slider-slide-form-format
          SrText(text="Posicion del texto" class="subtitle")
          SrGrid
            SrGridColumn(:size="{mobile: '1/3'}")
              label.slide-form-format-option
                input(type="radio" name="text-position" value="left" v-model="currentSlide.textPosition")
                SrIcon(name="trash-o")
            SrGridColumn(:size="{mobile: '1/3'}")
              label.slide-form-format-option
                input(type="radio" name="text-position" value="center" v-model="currentSlide.textPosition")
                SrIcon(name="trash-o")
            SrGridColumn(:size="{mobile: '1/3'}")
              label.slide-form-format-option
                input(type="radio" name="text-position" value="right" v-model="currentSlide.textPosition")
                SrIcon(name="trash-o")
        SrFormInput(label="Slide title" v-model="currentSlide.title" @input="updateSlide('title', i, $event)")
        SrFormInput(label="Slide description" type="textarea" v-model="currentSlide.description" @input="updateSlide('description', i, $event)")
        SrFormInput(label="Slide Link label" v-model="currentSlide.link.label" @input="updateSlide('link.label', i, $event)")
        SrFormSelect(label="Slide Link url" :options="pagesOtions" v-model="currentSlide.link.url" @change="updateSlide('link.url', i, $event)")
        
</template>

<script lang="ts" setup>
const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    required: true,
    default: () => ({
      creative: {},
      autoplay: {},
      loop: false,
      perPage: 1,
      effect: "creative",
    }),
  },
  editable: {
    type: Boolean,
    default: false,
  },
});
const currentResolution = ref("mobile");
const currentSlide: any = ref(null);
const slideModal: any = ref(null);
const pagesOtions = [
  { name: "No link", value: "" },
  { name: "Inicio", value: "/" },
  { name: "Nosotros", value: "/nosotros" },
  { name: "Servicios", value: "/servicios" },
  { name: "Contacto", value: "/contacto" },
];

const emits = defineEmits([
  "update:slide",
  "edit-props",
  "media-gallery",
  "icon-gallery",
  "preview",
  "delete",
  "edit",
  "input",
  "change",
  "toggle",
  "componentList",
]);

const slideSettings = (slide: any) => {
  currentSlide.value = slide;
  if (!currentSlide.value.video) {
    currentSlide.value.video = {
      url: "",
    };
  }
  if (!currentSlide.value.background) {
    currentSlide.value.background = {};
  }
  slideModal.value.toggle();
};

const updateSlide = (
  key: string,
  idx: number,
  { value }: { key: string; value: string },
) => {
  if (key.includes(".")) {
    const readObj = (keys: string, obj: any) => {
      const [k, ...rest] = keys.split(".");
      if (rest.length) {
        readObj(rest.join("."), obj[k]);
      } else {
        obj[k] = value;
      }
    };
    readObj(key, props.slides[idx]);
  } else {
    const slide: any = props.slides[idx];
    slide[key] = value;
  }
};
</script>

<style lang="scss">
.main-slider {
  width: 100%;
  overflow: hidden;
  &-slide {
    display: flex;
    min-height: pxToRem(400);
    overflow: hidden;
    position: relative;

    &-link {
      margin: auto;
      color: $color-quivi-light-red;
    }

    &-form {
      &-resolution {
        display: flex;
        gap: pxToRem(20);
        margin-bottom: pxToRem(20);
      }
    }

    .sr-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      display: flex;
      flex-direction: column;
    }

    .sr-text {
      .title {
        font-size: pxToRem(40);
        margin-bottom: pxToRem(40);
      }
    }

    &-options {
      position: absolute;
      top: 0;
      left: 0;
      background-color: $color-quivi-red;
      border: none;
      color: $color-white;
      padding: pxToRem(10);
      z-index: 3;
    }

    &-background {
      width: 100%;
      z-index: 1;

      .sr-picture {
        width: 100%;
        height: 100%;

        img {
          height: 100%;
        }
      }
    }
  }

  .swiper {
    &-button {
      &-next,
      &-prev {
        background-color: transparent !important;
      }
    }
  }
}
</style>
