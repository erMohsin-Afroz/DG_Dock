
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { RotateCcw, Save, Settings2 } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import FieldPalette from "./components/FieldPalette";
import FieldEditor from "./components/FieldEditor";
import FormPreview from "./components/FormPreview";

import { useFormPersistence } from "./hooks/formPersistence";
import { createField } from "./utils/fieldHelpers";

import type {
  FieldType,
  FormConfiguration,
  FormFieldConfig,
} from "./types";

interface BuilderFields {
  fields: FormFieldConfig[];
}

function FormBuilderPage() {
  const {
    configuration,
    setConfiguration,
    isSaved,
  } = useFormPersistence();

  const [selectedFieldId, setSelectedFieldId] =
    useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [showResetDialog, setShowResetDialog] =
    useState(false);

  const builderMethods = useForm<BuilderFields>({
    defaultValues: {
      fields: configuration.fields,
    },
  });

  const { control, reset } = builderMethods;

  const {
    fields,
    append,
    update,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "fields",
    keyName: "rhfId",
  });

  // Keep configuration synchronized with the field array.
  useEffect(() => {
    const nextFields = fields.map((item, index) => {
      const { rhfId: _rhfId, ...field } = item;

      return {
        ...field,
        order: index,
      } as FormFieldConfig;
    });

    setConfiguration((current) => ({
      ...current,
      fields: nextFields,
    }));
  }, [fields, setConfiguration]);

  const selectedIndex = fields.findIndex(
    (field) => field.id === selectedFieldId,
  );

  const selectedField =
    selectedIndex >= 0
      ? (fields[selectedIndex] as FormFieldConfig)
      : null;

  // Add a field without automatically opening its editor.
  const handleAddField = (type: FieldType) => {
    const newField = createField(type, fields.length);

    append(newField);
    setSelectedFieldId(newField.id);
  };

  // Open editor only when the Edit/Settings button is clicked.
  const handleOpenEditor = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setIsEditorOpen(true);
  };

  const handleUpdateField = (updated: FormFieldConfig) => {
    if (selectedIndex < 0) return;

    update(selectedIndex, updated);
  };

  const handleDeleteField = () => {
    if (selectedIndex < 0) return;

    remove(selectedIndex);
    setSelectedFieldId(null);
    setIsEditorOpen(false);
  };

  const handleMoveField = (direction: "up" | "down") => {
    if (selectedIndex < 0) return;

    const targetIndex =
      direction === "up"
        ? selectedIndex - 1
        : selectedIndex + 1;

    if (targetIndex < 0 || targetIndex >= fields.length) {
      return;
    }

    move(selectedIndex, targetIndex);
  };

  const handleTitleChange = (
    key: "title" | "description",
    value: string,
  ) => {
    setConfiguration((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleReset = () => {
    const emptyConfiguration: FormConfiguration = {
      title: "New Form",
      description: "Please complete the following form.",
      fields: [],
    };

    reset({ fields: [] });
    setConfiguration(emptyConfiguration);
    setSelectedFieldId(null);
    setIsEditorOpen(false);
    setShowResetDialog(false);
  };

  const orderedFields = useMemo(
    () =>
      fields
        .slice()
        .sort((a, b) => a.order - b.order),
    [fields],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dynamic Form Builder"
        description="Create configuration-driven forms, customise fields, and preview the generated form."
        action={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Save size={14} />
              {isSaved ? "Draft saved" : "Saving draft..."}
            </span>

            <button
              type="button"
              onClick={() => setShowResetDialog(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <RotateCcw size={15} />
              Reset Builder
            </button>
          </div>
        }
      />

      {/* Form Settings */}
      <section className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Form Title
          </span>

          <input
            value={configuration.title}
            onChange={(event) =>
              handleTitleChange("title", event.target.value)
            }
            placeholder="Enter form title"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Form Description
          </span>

          <input
            value={configuration.description}
            onChange={(event) =>
              handleTitleChange(
                "description",
                event.target.value,
              )
            }
            placeholder="Enter form description"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600"
          />
        </label>
      </section>

      {/* Builder Area */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left Column */}
        <div className="space-y-5">
          <FieldPalette onAdd={handleAddField} />

          {/* Field List */}
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-foreground">
                Form Fields
              </h2>

              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {fields.length}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {orderedFields.map((field) => (
                <div
                  key={field.id}
                  className={`flex items-center gap-2 rounded-lg border p-2 transition ${
                    selectedFieldId === field.id
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {/* Field name is now non-clickable */}
                  <div className="min-w-0 flex-1 p-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {field.label || "Untitled Field"}
                    </span>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      {field.type}
                      {field.required ? " · Required" : ""}
                    </span>
                  </div>

                  {/* Only this button opens Field Editor */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditor(field.id)}
                    aria-label={`Edit ${field.label} settings`}
                    title="Edit Field"
                    className="shrink-0 rounded-lg border border-border p-2 text-muted-foreground transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                  >
                    <Settings2 size={17} />
                  </button>
                </div>
              ))}

              {fields.length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  No fields added yet. Select a field type above to get started.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Live Preview */}
        <div className="min-w-0">
          <FormPreview configuration={configuration} />
        </div>
      </div>

      {/* Field Settings Dialog */}
      <FieldEditor
        field={selectedField}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onChange={handleUpdateField}
        onDelete={handleDeleteField}
        onMove={handleMoveField}
        canMoveUp={selectedIndex > 0}
        canMoveDown={
          selectedIndex >= 0 &&
          selectedIndex < fields.length - 1
        }
      />

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Form Builder?"
        description="This will remove all configured fields and reset the form title and description."
        confirmLabel="Reset Builder"
        cancelLabel="Keep Editing"
        onConfirm={handleReset}
      />
    </div>
  );
}

export default FormBuilderPage;
