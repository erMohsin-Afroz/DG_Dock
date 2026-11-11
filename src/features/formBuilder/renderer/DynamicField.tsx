
import {
  Controller,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import type {
  DynamicFormValues,
  FormFieldConfig,
} from "../types";
import { validateDynamicField } from "./fieldValidation";

interface DynamicFieldProps {
  field: FormFieldConfig;
  control: Control<DynamicFormValues>;
  errors: FieldErrors<DynamicFormValues>;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

function DynamicField({
  field,
  control,
  errors,
}: DynamicFieldProps) {
  const error = errors[field.id]?.message as
    | string
    | undefined;

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-foreground"
        >
          {field.label}
          {field.required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <Controller
        name={field.id}
        control={control}
        rules={{
          validate: (value) =>
            validateDynamicField(field, value),
        }}
        render={({ field: input }) => {
          switch (field.type) {
            case "textarea":
              return (
                <textarea
                  {...input}
                  id={field.id}
                  rows={4}
                  placeholder={field.placeholder}
                  className={inputClass}
                  value={String(input.value ?? "")}
                />
              );

            case "select":
              return (
                <select
                  {...input}
                  id={field.id}
                  className={inputClass}
                  value={String(input.value ?? "")}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );

            case "multiselect":
              return (
                <select
                  id={field.id}
                  multiple
                  className={`${inputClass} min-h-28`}
                  value={
                    Array.isArray(input.value)
                      ? input.value.map(String)
                      : []
                  }
                  onBlur={input.onBlur}
                  onChange={(event) =>
                    input.onChange(
                      Array.from(
                        event.target.selectedOptions,
                        (option) => option.value,
                      ),
                    )
                  }
                  ref={input.ref}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );

            case "checkbox":
              return (
                <label className="flex items-center gap-3">
                  <input
                    ref={input.ref}
                    type="checkbox"
                    checked={Boolean(input.value)}
                    onBlur={input.onBlur}
                    onChange={(event) =>
                      input.onChange(event.target.checked)
                    }
                    className="size-4 accent-emerald-700"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </span>
                </label>
              );

            default:
              return (
                <input
                  {...input}
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={inputClass}
                  value={String(input.value ?? "")}
                  min={
                    field.type === "number"
                      ? field.min
                      : undefined
                  }
                  max={
                    field.type === "number"
                      ? field.max
                      : undefined
                  }
                />
              );
          }
        }}
      />

      {field.helpText && (
        <p className="text-xs text-muted-foreground">
          {field.helpText}
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default DynamicField;
