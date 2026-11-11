
import type { FormFieldConfig } from "../types";
import { getFieldTypeLabel } from "../utils/fieldHelpers";
import { X } from "lucide-react";

interface FieldEditorProps {
  field: FormFieldConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: FormFieldConfig) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function FieldEditor({
  field,
  open,
  onOpenChange,
  onChange,
  onDelete,
  onMove,
  canMoveUp,
  canMoveDown,
}: FieldEditorProps) {
  if (!open || !field) return null;

  const update = (changes: Partial<FormFieldConfig>) => {
    onChange({ ...field, ...changes } as FormFieldConfig);
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

  const hasOptions =
    field.type === "select" ||
    field.type === "multiselect";

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="field-editor-title"
        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2
              id="field-editor-title"
              className="font-semibold text-foreground"
            >
              Field Settings
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {getFieldTypeLabel(field.type)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close field settings"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="space-y-5 overflow-y-auto p-5">
          {/* Reorder */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={() => onMove("up")}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↑ Move Up
            </button>

            <button
              type="button"
              disabled={!canMoveDown}
              onClick={() => onMove("down")}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↓ Move Down
            </button>
          </div>

          {/* Label */}
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Field Label
            </span>

            <input
              autoFocus
              className={inputClass}
              value={field.label}
              onChange={(event) =>
                update({ label: event.target.value })
              }
              placeholder="Enter field label"
            />
          </label>

          {/* Placeholder */}
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Placeholder
            </span>

            <input
              className={inputClass}
              value={field.placeholder}
              onChange={(event) =>
                update({ placeholder: event.target.value })
              }
              placeholder="Enter placeholder"
            />
          </label>

          {/* Help Text */}
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Help Text
            </span>

            <textarea
              rows={3}
              className={inputClass}
              value={field.helpText}
              onChange={(event) =>
                update({ helpText: event.target.value })
              }
              placeholder="Enter help text"
            />
          </label>

          {/* Required */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(event) =>
                update({ required: event.target.checked })
              }
              className="size-4 accent-emerald-700"
            />

            <span className="text-sm font-medium text-foreground">
              Required Field
            </span>
          </label>

          {/* Number Settings */}
          {field.type === "number" && (
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">
                  Minimum Value
                </span>

                <input
                  type="number"
                  className={inputClass}
                  value={field.min ?? ""}
                  onChange={(event) =>
                    update({
                      min:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">
                  Maximum Value
                </span>

                <input
                  type="number"
                  className={inputClass}
                  value={field.max ?? ""}
                  onChange={(event) =>
                    update({
                      max:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                />
              </label>
            </div>
          )}

          {/* Select Options */}
          {hasOptions && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Field Options
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add or edit the available options.
                </p>
              </div>

              {field.options.map((option, index) => (
                <div
                  key={`${field.id}-option-${index}`}
                  className="flex gap-2"
                >
                  <input
                    className={inputClass}
                    value={option}
                    onChange={(event) => {
                      const options = [...field.options];
                      options[index] = event.target.value;
                      update({ options });
                    }}
                    aria-label={`Option ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      update({
                        options: field.options.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      })
                    }
                    aria-label={`Remove option ${index + 1}`}
                    className="shrink-0 rounded-lg border border-border px-3 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  update({
                    options: [
                      ...field.options,
                      `Option ${field.options.length + 1}`,
                    ],
                  })
                }
                className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                + Add Option
              </button>
            </div>
          )}
        </div>

        {/* Dialog Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Delete Field
          </button>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  );
}

export default FieldEditor;
