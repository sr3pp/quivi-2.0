<template lang="pug">
.quivi-content
  .top-bar 
    SrFormSelect(:options="pagesOtions" value="/" placeholder="Seleccionar página")
    button(@click="contentModal = true") Edit Seo
    button(@click="testContent") testContent
    button(@click="componentModal = true") component list
  SrContainer(:with_space="true")
    SrText(value="Panel content" kind="title" alignment="center")
    component(v-for="(component, i) in content" :is="component.component" :key="i" v-bind="component.props")
    .fill
  SrModal(:active="contentModal" @close="contentModal = false")
    template(#body)
      .sr-modal-body
        SeoWizzard
  SrModal(:active="componentModal" @close="componentModal = false")
    template(#body)
      .sr-modal-body
        p list of components here
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "panel",
});

const contentModal: Ref<boolean> = ref(false);
const componentModal: Ref<boolean> = ref(false);

const pagesOtions = [
  {
    value: "/",
    name: "Home",
  },
];

const content: any = ref([]);

const testContent = () => {
  content.value = [
    {
      component: "SrText",
      props: {
        value: "Test",
      },
    },
  ];
};
</script>

<style lang="scss" scoped>
.quivi-content {
  .top-bar {
    background-color: blue;
    padding: unit(8);
    display: flex;
    align-items: center;
    position: sticky;
    z-index: 2;
    top: 0;

    .sr-form-select {
      width: unit(200);
    }
  }

  .fill {
    height: 110vh;
  }
}
</style>
