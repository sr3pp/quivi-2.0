import type { FieldSet } from "~/types/content";

const formatData = (data: any) => {
  const formattedData: any = {};

  const assignValue = (obj: any, key: string, value: any) => {
    if (key.includes(".")) {
      const keys: string[] = key.split(".") as string[];
      const parentKey: string = keys.shift() as string;
      if (!obj[parentKey]) {
        obj[parentKey] = {};
      }
      assignValue(obj[parentKey], keys.join("."), value);
    } else {
      obj[key] = value;
    }
  };

  Object.keys(data).forEach((key) => {
    const value = data[key];
    assignValue(formattedData, key, value);
  });
  return formattedData;
};

const validateMail = (mail: string) => {
  const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return mailRegex.test(mail);
};

const verifyFields = (data: any, field: any) => {
  const confirmationField = field.props.confirmation;
  const confirmationValue = data[confirmationField];
  const value = field.props.value;

  if (confirmationValue !== value) {
    return false;
  }

  return true;
};

export const validateForm = (form: FieldSet[], callback: Function) => {
  const data: any = {};
  const errors: any = [];

  form.forEach((fieldset: FieldSet) => {
    fieldset.fields.forEach((field: any) => {
      if (field.props.required && !field.props.value.length) {
        errors.push({ field: field.props.name, message: "Campo requerido" });
      }
      if (field.props.confirmation) {
        if (!verifyFields(data, field)) {
          errors.push({
            field: field.props.name,
            message: "Los campos no coinciden",
          });
        }
      }
      if (field.props.type === "email" && !validateMail(field.props.value)) {
        errors.push({ field: field.props.name, message: "Correo inválido" });
      }
      data[field.props.name] = field.props.value;
    });
  });

  if (errors.length > 0) {
    return callback({ errors });
  } else {
    const formattedData = formatData(data);
    return callback(formattedData);
  }
};
