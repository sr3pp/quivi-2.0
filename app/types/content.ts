import type { CSSProperties } from "vue";

export interface ComponentFormProps {
  [key: string | number]: string | number | boolean | object | undefined;
  value: string | number | boolean;
  placeholder?: string;
  label?: string;
  name: string;
  type?: string;
  hint?: string;
  error?: string;
  info?: string;
  required?: boolean;
  options?: Array<any>;
  confirmation?: string;
}

export interface ComponentProps {
  [key: string | boolean | number]:
    | string
    | number
    | boolean
    | object
    | Component[];
  text?: string;
  alt?: string;
  src?: string;
  name?: string;
  content?: Component[];
  css?: {
    class: string;
    style: CSSProperties;
  };
}

export interface Component {
  [key: string]:
    | string
    | boolean
    | number
    | Array
    | ComponentProps
    | ComponentFormProps;
  component: string;
  props: ComponentProps | ComponentFormProps;
  content?: Component[];
  items?: Component[];
}

export interface FieldSet {
  name?: string;
  fields: Component[];
}

export interface Media {
  url: string;
  alt: string;
  type: string;
}

export interface Directory {
  [key: string]: string | boolean | Directory[] | undefined | null;
  name: string;
  path: string;
  open?: boolean;
  children?: Directory[] | null;
}

export interface BreakpointObj {
  [key: string]: string | number | unknown;
  mobile: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
}
