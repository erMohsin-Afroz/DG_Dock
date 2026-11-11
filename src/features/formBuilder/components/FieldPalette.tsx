
import { FIELD_TYPES, type FieldType } from "../types";

interface FieldPaletteProps {
  onAdd: (type: FieldType) => void;
}

function FieldPalette({ onAdd }: FieldPaletteProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold text-foreground">
        Add Field
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Select a field type to add it to your form.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {FIELD_TYPES.map((field) => (
          <button
            key={field.value}
            type="button"
            onClick={() => onAdd(field.value)}
            className="rounded-lg border border-border px-3 py-2.5 text-left text-sm text-foreground transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
          >
            + {field.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default FieldPalette;
