
import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import type {
  DynamicFormValues,
  FormConfiguration,
} from "../types";

import { createDefaultValue } from "../utils/fieldHelpers";
import DynamicField from "../renderer/DynamicField";

interface FormPreviewProps {
  configuration: FormConfiguration;
}

const DRAFT_KEY = "dg-dock-dynamic-form-draft";

interface ContactGroupProps {
  disabled?: boolean;
}

function ContactGroup({ disabled = false }: ContactGroupProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<DynamicFormValues>();

  // Explicit generic and assertion fix the FieldArrayPath
  // inference issue caused by dynamic form field keys.
  const { fields, append, remove } = useFieldArray<
    DynamicFormValues
  >({
    control,
    name: "contacts" as never,
  });

  const contactErrors = errors.contacts;

  return (
    <section className="space-y-4 rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">
            Additional Contacts
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Add one or more additional contact persons.
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            append({
              name: "",
              email: "",
            })
          }
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add Contact
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No additional contacts added.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2"
            >
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">
                  Contact Name
                </span>

                <input
                  {...register(`contacts.${index}.name` as const, {
                    maxLength: {
                      value: 60,
                      message: "Name cannot exceed 60 characters.",
                    },
                  })}
                  disabled={disabled}
                  placeholder="Enter contact name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-50"
                />

                {contactErrors?.[index]?.name?.message && (
                  <p className="text-xs text-red-600">
                    {contactErrors[index]?.name?.message}
                  </p>
                )}
              </label>

              <div className="space-y-1.5">
                <label
                  htmlFor={`contact-email-${item.id}`}
                  className="text-sm font-medium text-foreground"
                >
                  Contact Email
                </label>

                <div className="flex gap-2">
                  <input
                    id={`contact-email-${item.id}`}
                    type="email"
                    {...register(`contacts.${index}.email` as const, {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address.",
                      },
                    })}
                    disabled={disabled}
                    placeholder="contact@example.com"
                    className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-50"
                  />

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => remove(index)}
                    aria-label={`Remove contact ${index + 1}`}
                    className="rounded-lg border border-border px-3 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>

                {contactErrors?.[index]?.email?.message && (
                  <p className="text-xs text-red-600">
                    {contactErrors[index]?.email?.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PreviewFields({
  configuration,
}: FormPreviewProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<DynamicFormValues>();

  const sortedFields = [...configuration.fields].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="space-y-5">
      {sortedFields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          control={control}
          errors={errors}
        />
      ))}
    </div>
  );
}

function FormPreview({ configuration }: FormPreviewProps) {
  const [submittedData, setSubmittedData] =
    useState<DynamicFormValues | null>(null);

  const [copyMessage, setCopyMessage] = useState("");

  const defaultValues = useMemo(() => {
    const values: DynamicFormValues = {
      contacts: [],
    };

    configuration.fields.forEach((field) => {
      values[field.id] = createDefaultValue(field);
    });

    return values;
  }, [configuration.fields]);

  const initialValues = useMemo(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as DynamicFormValues;

        return {
          ...defaultValues,
          ...parsed,
          contacts: Array.isArray(parsed.contacts)
            ? parsed.contacts
            : [],
        };
      }
    } catch {
      // Fall back to generated defaults.
    }

    return defaultValues;
  }, [defaultValues]);

  const methods = useForm<DynamicFormValues>({
    defaultValues: initialValues,
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const {
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  // Preserve values when fields are added, edited or removed.
  useEffect(() => {
    const currentValues = getValues();

    const nextValues: DynamicFormValues = {
      ...defaultValues,
      contacts: currentValues.contacts ?? [],
    };

    configuration.fields.forEach((field) => {
      nextValues[field.id] =
        currentValues[field.id] !== undefined
          ? currentValues[field.id]
          : createDefaultValue(field);
    });

    reset(nextValues);
    setSubmittedData(null);
    setCopyMessage("");
  }, [configuration.fields, defaultValues, getValues, reset]);

  // Save form draft in localStorage.
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify(values),
        );
      } catch {
        // Ignore storage errors.
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (values: DynamicFormValues) => {
    await new Promise((resolve) =>
      window.setTimeout(resolve, 500),
    );

    setSubmittedData(values);
    setCopyMessage("");
  };

  const resetPreview = () => {
    reset(defaultValues);

    localStorage.removeItem(DRAFT_KEY);

    setSubmittedData(null);
    setCopyMessage("");
  };

  const copySubmittedData = async () => {
    if (!submittedData) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(submittedData, null, 2),
      );

      setCopyMessage("JSON copied successfully.");
    } catch {
      setCopyMessage("Unable to copy JSON.");
    }
  };

  const hasFields = configuration.fields.length > 0;

  const liveValues = useWatch({
    control: methods.control,
  });

  return (
    <FormProvider {...methods}>
      <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
        {/* Preview Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-semibold text-foreground">
              {configuration.title || "Untitled Form"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {configuration.description ||
                "No form description provided."}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            Live Preview
          </span>
        </div>

        <div className="space-y-6 p-5">
          {!hasFields ? (
            <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center">
              <h3 className="font-semibold text-foreground">
                Your form is empty
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Add fields using the Field Palette to see your
                generated form here.
              </p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <PreviewFields configuration={configuration} />

              <ContactGroup disabled={isSubmitting} />

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={resetPreview}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  Reset Preview
                </button>
              </div>
            </form>
          )}

          {/* Submission Result */}
          {submittedData && (
            <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div>
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Form Submitted Successfully
                </h3>

                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                  Your form was submitted locally. No backend or
                  external API was used.
                </p>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Submitted JSON
                  </h4>

                  <button
                    type="button"
                    onClick={copySubmittedData}
                    className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-950"
                  >
                    Copy JSON
                  </button>
                </div>

                <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-background p-4 text-xs leading-5 text-foreground">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>

                {copyMessage && (
                  <p
                    role="status"
                    className="mt-2 text-xs text-emerald-700 dark:text-emerald-400"
                  >
                    {copyMessage}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={resetPreview}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Create Another Submission
              </button>
            </section>
          )}

          {/* Current Draft Values */}
          {hasFields && (
            <details className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                View Current Draft Values
              </summary>

              <pre className="mt-3 max-h-60 overflow-auto rounded-lg bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
                {JSON.stringify(liveValues, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </section>
    </FormProvider>
  );
}

export default FormPreview;
