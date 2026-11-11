
import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

import type {
  User,
  UserInput,
  UserRole,
  UserStatus,
} from "../types";

interface UserFormDialogProps {
  open: boolean;
  initialUser: User | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: UserInput) => void;
}

const emptyForm: UserInput = {
  name: "",
  email: "",
  role: "Viewer",
  status: "Active",
  company: "",
};

function UserFormDialog({
  open,
  initialUser,
  isSubmitting,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
  const [form, setForm] = useState<UserInput>(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(
        initialUser
          ? {
              name: initialUser.name,
              email: initialUser.email,
              role: initialUser.role,
              status: initialUser.status,
              company: initialUser.company,
            }
          : emptyForm
      );
    }
  }, [open, initialUser]);

  if (!open) return null;

  const updateField = <K extends keyof UserInput>(
    field: K,
    value: UserInput[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
      company: form.company.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2
              id="user-form-title"
              className="text-lg font-semibold text-foreground"
            >
              {initialUser ? "Edit User" : "Create User"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {initialUser
                ? "Update the user's information."
                : "Add a new user to the data explorer."}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Full Name *
            </label>

            <input
              id="user-name"
              type="text"
              required
              minLength={2}
              maxLength={60}
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Enter full name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="user-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email Address *
            </label>

            <input
              id="user-email"
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              placeholder="name@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="user-company"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Company *
            </label>

            <input
              id="user-company"
              type="text"
              required
              maxLength={80}
              value={form.company}
              onChange={(event) =>
                updateField("company", event.target.value)
              }
              placeholder="Enter company name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="user-role"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Role
              </label>

              <select
                id="user-role"
                value={form.role}
                onChange={(event) =>
                  updateField("role", event.target.value as UserRole)
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="user-status"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Status
              </label>

              <select
                id="user-status"
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as UserStatus)
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !form.name.trim() ||
                !form.email.trim() ||
                !form.company.trim()
              }
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : initialUser
                  ? "Save Changes"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormDialog;
