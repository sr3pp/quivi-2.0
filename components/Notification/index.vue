<template lang="pug">
article.quivi-notification(:class="{active: status}" @mouseover="cancelTimeout" @mouseleave="setCloseTimeout")
  button.quivi-notification-close(@click="$emit('close')") X
  SrText.quivi-notification-title(:text="title" class="subtitle")
  .quivi-notification-content
    slot
    .quivi-notification-description(v-if="description")
      SrText(:text="description")
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: "Title",
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);
const timeout = ref(
  setTimeout(() => {
    emit("close");
  }, 5000),
);
onMounted(() => {
  timeout.value;
});

const cancelTimeout = () => {
  clearTimeout(timeout.value);
};

const setCloseTimeout = () => {
  timeout.value = setTimeout(() => {
    emit("close");
  }, 5000);
};
</script>

<style lang="scss" scoped>
.quivi-notification {
  background-color: rgba($color-system-success, 0.3);
  backdrop-filter: blur(pxToRem(6));
  width: 20vw;
  min-width: pxToRem(200);
  border: {
    style: solid;
    color: $color-system-success;
    width: pxToRem(2);
    radius: pxToRem(8);
  }

  padding: pxToRem(10);

  transform: translateY(100%);
  opacity: 0;
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;

  &.active {
    opacity: 1;
    transform: translateY(0);
  }

  &-close {
    position: absolute;
    top: pxToRem(-10);
    right: pxToRem(-10);
    width: uniy(40);
    height: uniy(40);
    flex-shrink: 0;
    border-radius: pxToRem(20);
    background: $color-quivi-red;
    border: none;
    cursor: pointer;
    font-size: pxToRem(18);
    font-family: Bebas;
    color: $color-white;
  }
}
</style>
