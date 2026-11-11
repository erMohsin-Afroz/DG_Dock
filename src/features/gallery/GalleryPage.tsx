
import PageHeader from "@/components/common/PageHeader";
import { Toaster } from "@/components/ui/sonner";

import ButtonShowcase from "./components/ButtonShowcase";
import FormControlsShowcase from "./components/FormControls";
import DialogShowcase from "./components/DialogShowcase";
import DropdownShowcase from "./components/DropdownShowcase";
import FeedbackShowcase from "./components/FeedbackShowcase";
import DataDisplayShowcase from "./components/DataDisplay";

function GalleryPage() {
  return (
    <div className="min-h-full space-y-6">
      <Toaster position="top-right" richColors />

      <PageHeader
        title="Component Gallery"
        description="Explore interactive shadcn/ui components, variants, states and reusable interface patterns."
      />

      {/* Gallery Introduction */}
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              UI Component Library
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              A collection of reusable components demonstrating
              consistent design, accessibility and interaction.
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            Interactive Showcase
          </span>
        </div>
      </section>

      {/* Buttons */}
      <section id="buttons">
        <ButtonShowcase />
      </section>

      {/* Form Controls */}
      <section id="form-controls">
        <FormControlsShowcase />
      </section>

      {/* Dialogs and Sheets */}
      <section id="dialogs">
        <DialogShowcase />
      </section>

      {/* Dropdowns */}
      <section id="dropdowns">
        <DropdownShowcase />
      </section>

      {/* Feedback */}
      <section id="feedback">
        <FeedbackShowcase />
      </section>

      {/* Data Display */}
      <section id="data-display">
        <DataDisplayShowcase />
      </section>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        DG Dock · Component Gallery
      </footer>
    </div>
  );
}

export default GalleryPage;
