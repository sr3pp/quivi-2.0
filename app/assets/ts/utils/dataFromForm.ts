import type { Component, FieldSet } from "~/types/content";

export const dataFromForm = (form: FieldSet[]) => {
  const data: any = {};
  form.forEach((fieldset: FieldSet) => {
    fieldset.fields.forEach((field: Component) => {
      const name: string = field.props.name as string;
      if (name.includes(".")) {
        const names = name.split(".");
        const value = field.props.value;
        data[names[0]] = {
          ...data[names[0]],
          [names[1]]: value,
        };
      } else {
        const value = field.props.value;
        data[name] = value;
      }
    });
  });

  return data;
};
