export interface NamedOption<T = string | number> {
  value: T;
  name: string;
}

export interface LabeledOption<T = string> {
  value: T;
  label: string;
}
