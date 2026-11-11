
import type {
  FieldType,
  FormFieldConfig,
} from "../types";

export function createField(
  type: FieldType,
  order: number,
): FormFieldConfig {
  const base = {
    id: crypto.randomUUID(),
    label: `New ${type} field`,
    required: false,
    placeholder: "",
    helpText: "",
    order,
  };

  switch (type) {
    case "number":
      return { ...base, type, min: undefined, max: undefined };

    case "select":
    case "multiselect":
      return {
        ...base,
        type,
        options: ["Option 1", "Option 2"],
      };

    case "checkbox":
      return { ...base, type };

    default:
      return { ...base, type };
  }
}

export function createDefaultValue(
  field: FormFieldConfig,
): unknown {
  switch (field.type) {
    case "checkbox":
      return false;
    case "multiselect":
      return [];
    default:
      return "";
  }
}

export function getFieldTypeLabel(type: FieldType) {
  return {
    text: "Short Text",
    textarea: "Long Text",
    number: "Number",
    email: "Email",
    date: "Date",
    select: "Single Select",
    multiselect: "Multi Select",
    checkbox: "Checkbox",
    url: "URL",
  }[type];
}
