
import type { FormFieldConfig } from "../types";

export function validateDynamicField(
  field: FormFieldConfig,
  value: unknown,
): true | string {
  const empty =
    value === undefined ||
    value === null ||
    value === "";

  if (field.type === "checkbox") {
    if (field.required && value !== true) {
      return `${field.label} must be checked.`;
    }

    return true;
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];

    if (field.required && selected.length === 0) {
      return `Please select at least one ${field.label}.`;
    }

    return true;
  }

  if (empty) {
    return field.required
      ? `${field.label} is required.`
      : true;
  }

  const stringValue = String(value);

  switch (field.type) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)
        ? true
        : "Enter a valid email address.";

    case "url":
      try {
        const url = new URL(stringValue);

        return ["http:", "https:"].includes(url.protocol)
          ? true
          : "Enter a valid HTTP or HTTPS URL.";
      } catch {
        return "Enter a valid URL.";
      }

    case "number": {
      const number = Number(value);

      if (!Number.isFinite(number)) {
        return "Enter a valid number.";
      }

      if (field.min !== undefined && number < field.min) {
        return `Minimum value is ${field.min}.`;
      }

      if (field.max !== undefined && number > field.max) {
        return `Maximum value is ${field.max}.`;
      }

      return true;
    }

    case "select":
      return field.options.includes(stringValue)
        ? true
        : "Select a valid option.";

    case "text":
    case "textarea":
    case "date":
      return true;

    default:
      return true;
  }
}
