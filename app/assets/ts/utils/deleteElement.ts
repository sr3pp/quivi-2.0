import type { Component } from "~/types/content";

export const deleteElement = (parent: Component[], idx: number) => {
  parent.splice(idx, 1);
};
