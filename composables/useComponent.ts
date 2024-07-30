const currentComponent: Ref<any> = ref(null);

export function useComponent(content: any) {
  const editComponent = (
    $event: any,
    _component: Component,
    callback?: () => void,
  ) => {
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

    callback?.();
  };

  const insertComponent = (callback?: () => void) => {
    const component = {
      component: "SrText",
      props: {
        editable: true,
        css: {
          class: "",
          style: {},
        },
        text: "Text",
      },
    };
    currentComponent.value.component.props.content.push(component);
    callback?.();
  };

  return { editComponent, insertComponent, currentComponent };
}
