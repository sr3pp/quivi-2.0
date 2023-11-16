<template lang="pug">
.quivi-accordion
    button.quivi-accordion-label(@click="toggle")
        SrText(:value="label" kind="subtitle")
        .quivi-accordion-label-icon
            SrIcon(value="chevron-down-o")
    .quivi-accordion-content(:class="{ active }")
        slot(name="content")
</template>

<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["toogle"]);
const toggle = () => {
  emit("toogle");
};
</script>

<style lang="scss">
.quivi-accordion {
  &-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding-top: unit(10);
    padding-bottom: unit(10);
    border-bottom: 1px solid $color-quivi-gray;
    .sr-icon {
      width: unit(20);
      height: unit(20);
    }
  }
  &-content {
    padding-top: unit(10);
    padding-bottom: unit(10);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;

    &.active {
      max-height: 100vh;
    }
  }
}
</style>
