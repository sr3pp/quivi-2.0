import type { Component } from "sr-content-2/types";
const currentPicture: any = ref({
  thumb: "",
  props: {
    src: "",
  },
  bg: {},
});

export function usePicture() {
  const isBackground = ref(false);
  const mediaModal = ref(null);

  const editPicture = (picture: any, callback?: () => void) => {
    currentPicture.value = picture;
    isBackground.value = false;
    callback?.();
  };

  const setPicture = (url: string, callback?: () => void) => {
    if (isBackground.value) {
      (currentPicture.value.props as any).css.style.backgroundImage =
        `url(${url})`;
    } else if ("thumb" in currentPicture.value) {
      currentPicture.value.thumb = url;
    } else if (currentPicture.value.props) {
      currentPicture.value.props.src = url;
    } else {
      const { bg, resolution }: any = currentPicture.value;
      bg[resolution] = url;
    }
    callback?.();
  };

  return {
    isBackground,
    currentPicture,
    mediaModal,
    editPicture,
    setPicture,
  };
}
