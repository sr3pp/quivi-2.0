import { SrAccordionGroup } from "#build/components";

const currentComponent: Ref<any> = ref(null);

const componentDefaults: any = {
  SrContainer: {
    withPadding: true,
    contained: true,
    editable: true,
  },
  SrText: {
    editable: true,
    text: "Text",
  },
  SrAccordion: {
    content: [
      {
        component: "SrText",
        props: {
          editable: true,
          text: "Text",
        },
      },
    ],
    label: "Accordion",
  },
  SrAccordionGroup: {
    content: [
      {
        label: "Accordion",
        content: [
          {
            component: "SrText",
            props: {
              editable: true,
              text: "Text",
            },
          },
        ],
      },
    ],
    label: "Accordion Group",
  },
  SrGrid: {
    content: [
      {
        component: "SrGridColumn",
        props: {
          size: {
            mobile: "1",
          },
          editable: true,
          content: [
            {
              component: "SrText",
              editable: true,
              props: {
                text: "Text",
              },
            },
          ],
        },
      },
    ],
  },
  SrGridColumn: {
    size: {
      mobile: "1",
    },
    editable: true,
    content: [
      {
        component: "SrText",
        props: {
          editable: true,
          text: "Text",
        },
      },
    ],
  },
};

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

  const insertComponent = (_component: string, callback?: () => void) => {
    const component = {
      component: _component,
      props: {
        ...componentDefaults[_component],
        editable: true,
      },
    };
    currentComponent.value.component.props.content.push(component);
    callback?.();
  };

  return { editComponent, insertComponent, currentComponent };
}
