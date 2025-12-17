import type { Component } from "~/types/content";

export const proccessContent = (content: Component[], sw: boolean = false) => {
  const getContent = (component: Component) => {
    if (component.component) {
      if (component.component.includes("Tabs")) {
        return component.props.tabs;
      } else if (component.component.includes("DropdownList")) {
        return component.props.items;
      }
    }
    return component.props?.content || component.content || component.items;
  };

  const setEditable = (component: Component | any, _sw: boolean) => {
    const elements = getContent(component);
    if ("props" in component) {
      component.props.editable = _sw;
    } else {
      component.editable = _sw;
    }
    if (component.component && component.component.includes("Picture")) {
      component.props.width = "auto";
      component.props.height = "auto";
    }

    if (elements) {
      elements.forEach((el: any) => {
        setEditable(el, _sw);
      });
    }

    return component;
  };

  const _content = [
    ...content.map((el) => {
      return setEditable(el, sw);
    }),
  ];
  return _content;
};
