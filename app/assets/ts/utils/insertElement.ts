import type { Component, ComponentProps } from "~/types";

export const insertElement = (
  parent: Component,
  element: Component,
  sw: boolean,
) => {
  (parent.props.content as Component[])[sw ? "push" : "unshift"](element);
};
