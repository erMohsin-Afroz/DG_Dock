
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "date"
  | "select"
  | "multiselect"
  | "checkbox"
  | "url";

interface BaseField {
  id: string;
  label: string;
  required: boolean;
  placeholder: string;
  helpText: string;
  order: number;
}

export interface TextField extends BaseField {
  type: "text" | "textarea" | "email" | "date" | "url";
}

export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
}

export interface SelectField extends BaseField {
  type: "select" | "multiselect";
  options: string[];
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
}

export type FormFieldConfig =
  | TextField
  | NumberField
  | SelectField
  | CheckboxField;

export interface FormConfiguration {
  title: string;
  description: string;
  fields: FormFieldConfig[];
}

export interface RepeatableContact {
  name: string;
  email: string;
}

export interface DynamicFormValues {
  [key: string]: unknown;
  contacts: RepeatableContact[];
}

export const FIELD_TYPES: {
  value: FieldType;
  label: string;
}[] = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "select", label: "Single Select" },
  { value: "multiselect", label: "Multi Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "url", label: "URL" },
];

export const defaultConfiguration: FormConfiguration = {
  title: "New Form",
  description: "Please complete the following form.",
  fields: [],
};
