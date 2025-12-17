import type { Component } from "~/types";
export const toggleValue = (
  component: Component,
  key: string,
  value: boolean,
): boolean => {
  component.props[key as string] = !value;
  return !value;
};
