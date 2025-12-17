<template lang="pug">
article.quivi-notification(:class="{active: status}" :style="{ '--main-color': type === 'success' ? toRgba(colorSystemSuccess) : toRgba(colorSystemError) }" @mouseover="cancelTimeout" @mouseleave="setCloseTimeout")
  button.quivi-notification-close(@click="$emit('close')") X
  SrText.quivi-notification-title(:text="title" class="subtitle")
  button.quivi-notification-content(@click="clickHandler")
    slot
    .quivi-notification-description(v-if="description")
      SrText(:html="description")
</template>

<script lang="ts" setup>
import { colorSystemSuccess, colorSystemError } from "~/assets/ts/tokens";
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
  type: {
    type: String,
    default: "success",
  },
  clickHandler: {
    type: Function,
    default: () => {},
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

const toRgba = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};
</script>

<style lang="scss" scoped>
.quivi-notification {
  --main-color: #{$color-system-success};
  background-color: rgba(var(--main-color), 0.3);
  backdrop-filter: blur(pxToRem(6));
  width: 20vw;
  min-width: pxToRem(200);
  border: {
    style: solid;
    color: rgba(var(--main-color), 1);
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

  &-content {
    background-color: transparent;
    border: none;
    cursor: pointer;
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
    font-size: pxToRem(16);
    font-family: Bebas;
    color: $color-white;
  }
}
</style>
