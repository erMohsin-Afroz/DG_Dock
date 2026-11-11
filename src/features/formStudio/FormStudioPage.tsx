import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type FieldPath,
} from "react-hook-form";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import FormField, {
  inputClassName,
} from "./components/FormField";

import ContactForm from "./components/ContactForm";

import {
  defaultFormValues,
  interestOptions,
  steps,
  type FormValues,
} from "./types";

const stepFields: FieldPath<FormValues>[][] = [
  ["firstName", "lastName", "dateOfBirth", "age", "gender"],

  [
    "email",
    "phone",
    "website",
    "address",
    "city",
    "postalCode",
    "preferredContact",
  ],

  ["interests"],

  ["occupation", "bio", "password", "confirmPassword"],
];

// Review submitted form values
function ReviewValues() {
  const values = useWatch<FormValues>();

  const rows = [
    [
      "Name",
      `${values.firstName ?? ""} ${values.lastName ?? ""}`.trim(),
    ],
    ["Date of Birth", values.dateOfBirth || "Not provided"],
    [
      "Age",
      values.age === "" ? "Not provided" : String(values.age),
    ],
    ["Gender", values.gender || "Not provided"],
    ["Email", values.email],
    ["Phone", values.phone],
    ["Website", values.website || "Not provided"],
    [
      "Address",
      [
        values.address,
        values.city,
        values.postalCode,
      ]
        .filter(Boolean)
        .join(", ") || "Not provided",
    ],
    ["Preferred Contact", values.preferredContact],
    [
      "Interests",
      values.interests?.join(", ") || "None selected",
    ],
    [
      "Newsletter",
      values.newsletter ? "Subscribed" : "Not subscribed",
    ],
    ["Occupation", values.occupation || "Not provided"],
    ["About", values.bio || "Not provided"],
  ];

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
        >
          <span className="text-sm text-muted-foreground">
            {label}
          </span>

          <span className="break-words text-sm font-medium text-foreground">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function FormStudioContent() {
  const {
    register,
    control,
    setValue,
    trigger,
    reset,
    handleSubmit,
    formState: {
      errors,
      isDirty,
      isSubmitting,
      isValid,
    },
  } = useFormContext<FormValues>();

  const [activeStep, setActiveStep] = useState(0);

  const [showResetDialog, setShowResetDialog] =
    useState(false);

  const [showLeaveDialog, setShowLeaveDialog] =
    useState(false);

  const [successData, setSuccessData] =
    useState<FormValues | null>(null);

  const [attemptedStep, setAttemptedStep] =
    useState(false);

  const watchedInterests =
    useWatch({
      control,
      name: "interests",
    }) ?? [];

  const password = useWatch({
    control,
    name: "password",
  });

  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });

  // Revalidate confirm password when password changes
  useEffect(() => {
    if (confirmPassword) {
      void trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  // Error summary
  const allErrors = useMemo(
    () =>
      Object.entries(errors)
        .map(([field, error]) => ({
          field,
          message: error?.message as string | undefined,
        }))
        .filter((item) => item.message),
    [errors]
  );

  // Browser warning for unsaved changes
  useEffect(() => {
    const warnBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
      if (!isDirty || successData) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      warnBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        warnBeforeUnload
      );
    };
  }, [isDirty, successData]);

  // Next step with validation
  const goNext = async () => {
    setAttemptedStep(true);

    const valid = await trigger(
      stepFields[activeStep],
      { shouldFocus: true }
    );

    if (valid) {
      setAttemptedStep(false);

      setActiveStep((current) =>
        Math.min(current + 1, steps.length - 1)
      );
    }
  };

  // Previous step
  const goBack = () => {
    setAttemptedStep(false);

    setActiveStep((current) =>
      Math.max(current - 1, 0)
    );
  };

  // Local form submission
  const submitForm = async (values: FormValues) => {
    await new Promise((resolve) =>
      window.setTimeout(resolve, 650)
    );

    setSuccessData(values);
    toast.success("Profile submitted successfully.");
  };

  const handleFormSubmit = (
  event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      // Submission is allowed only on the Review step
      if (activeStep !== steps.length - 1) {
        console.log("Form submission blocked. Current step:", activeStep);
        return;
      }

      console.log("Final form submission started.");

      void handleSubmit(submitForm)(event);
    };

  // Reset form
  const confirmReset = () => {
    reset(defaultFormValues);

    setActiveStep(0);
    setAttemptedStep(false);
    setSuccessData(null);
    setShowResetDialog(false);
  };

  // Leave form
  const handleLeave = () => {
    setShowLeaveDialog(false);

    reset(defaultFormValues);

    setActiveStep(0);
    setSuccessData(null);
    setAttemptedStep(false);
  };

  // Demonstrate setValue
  const setTodayAsDate = () => {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

    setValue("dateOfBirth", today, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <PageHeader
        title="React Hook Form – Form Studio"
        description="Build and validate a multi-section profile form with a guided review and local submission."
        action={
          <button
            type="button"
            onClick={() => setShowResetDialog(true)}
            disabled={!isDirty && !successData}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={16} />
            Reset Form
          </button>
        }
      />

      {/* Success Message */}
      {successData && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-emerald-700 dark:text-emerald-400" />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-emerald-800 dark:text-emerald-300">
                Form Submitted Successfully
              </h2>

              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                Your profile was submitted locally. No backend or external API was used.
              </p>

              <button
                type="button"
                onClick={() => {
                  reset(defaultFormValues);
                  setActiveStep(0);
                  setSuccessData(null);
                }}
                className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Create Another Profile
              </button>
            </div>
          </div>
        </section>
      )}

      {!successData && (
        <>
          {/* Progress Section */}
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Registration Progress
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Step {activeStep + 1} of {steps.length}
                </p>
              </div>

              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {Math.round(
                  ((activeStep + 1) / steps.length) * 100
                )}%
              </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{
                  width: `${
                    ((activeStep + 1) / steps.length) * 100
                  }%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
              {steps.map((step, index) => (
                <button
                  type="button"
                  key={step.title}
                  onClick={async () => {
                    if (index <= activeStep) {
                      setActiveStep(index);
                      return;
                    }

                    const valid = await trigger(
                      stepFields[activeStep] ?? [],
                      { shouldFocus: true }
                    );

                    if (valid) {
                      setActiveStep(index);
                    } else {
                      setAttemptedStep(true);
                    }
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-xs transition ${
                    index === activeStep
                      ? "bg-emerald-700 text-white"
                      : index < activeStep
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  <span className="block font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-1 block">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Main Form */}
          <form
            noValidate
            onSubmit={handleFormSubmit}
            className="rounded-xl border border-border bg-card"
          >
            <div className="border-b border-border p-5">
              <h2 className="text-lg font-semibold text-foreground">
                {steps[activeStep].title}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {steps[activeStep].description}
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>
                  {isDirty
                    ? "Unsaved Changes"
                    : "No Changes Yet"}
                </span>

                <span>
                  {isValid
                    ? "No Validation Errors"
                    : "Validation Pending"}
                </span>
              </div>
            </div>

            {/* Error Summary */}
            {attemptedStep && allErrors.length > 0 && (
              <div
                className="mx-5 mt-5 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/40"
                role="alert"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
                  <AlertCircle size={16} />
                  Please correct the following fields:
                </div>

                <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-700 dark:text-red-300">
                  {allErrors.map((item) => (
                    <li key={item.field}>
                      {item.field}: {item.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-5">

              {/* STEP 1: Personal Details */}
              {activeStep === 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <FormField
                    label="First Name"
                    htmlFor="firstName"
                    required
                    error={errors.firstName?.message}
                  >
                    <input
                      id="firstName"
                      autoComplete="given-name"
                      placeholder="Enter first name"
                      className={inputClassName}
                      {...register("firstName", {
                        required: "First name is required.",
                        minLength: {
                          value: 2,
                          message: "First name must contain at least 2 characters.",
                        },
                        maxLength: {
                          value: 40,
                          message: "First name cannot exceed 40 characters.",
                        },
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Last Name"
                    htmlFor="lastName"
                    required
                    error={errors.lastName?.message}
                  >
                    <input
                      id="lastName"
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      className={inputClassName}
                      {...register("lastName", {
                        required: "Last name is required.",
                        minLength: {
                          value: 2,
                          message: "Last name must contain at least 2 characters.",
                        },
                        maxLength: {
                          value: 40,
                          message: "Last name cannot exceed 40 characters.",
                        },
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Date of Birth"
                    htmlFor="dateOfBirth"
                    required
                    error={errors.dateOfBirth?.message}
                    >
                    <div className="flex gap-2">
                        <input
                        id="dateOfBirth"
                        type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        className={inputClassName}
                        {...register("dateOfBirth", {
                            required: "Date of birth is required.",
                            validate: (value) =>
                            value <= new Date().toISOString().slice(0, 10) ||
                            "Date of birth cannot be in the future.",
                        })}
                        />

                        <button
                        type="button"
                        onClick={setTodayAsDate}
                        className="shrink-0 rounded-lg border border-border px-3 text-xs hover:bg-muted"
                        >
                        Today
                        </button>
                    </div>
                    </FormField>

                  <FormField
                    label="Age"
                    htmlFor="age"
                    required
                    error={errors.age?.message}
                  >
                    <input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="Enter your age"
                      className={inputClassName}
                      {...register("age", {
                        valueAsNumber: true,
                        required: "Age is required.",
                        min: {
                          value: 18,
                          message: "Age must be at least 18.",
                        },
                        max: {
                          value: 100,
                          message: "Age cannot exceed 100.",
                        },
                        validate: (value) =>
                          Number.isFinite(value) ||
                          "Enter a valid age.",
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Gender"
                    htmlFor="gender"
                    required
                    error={errors.gender?.message}
                  >
                    <Controller
                      name="gender"
                      control={control}
                      rules={{
                        required: "Select an option.",
                      }}
                      render={({ field }) => (
                        <select
                          id="gender"
                          className={inputClassName}
                          {...field}
                        >
                          <option value="">Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      )}
                    />
                  </FormField>
                </div>
              )}

              {/* STEP 2: Contact Details */}
              {activeStep === 1 && <ContactForm />}

              {/* STEP 3: Preferences */}
              {activeStep === 2 && (
                <div className="space-y-6">

                  <FormField
                    label="Areas of Interest"
                    htmlFor="interests"
                    hint="Choose one or more interests."
                    error={errors.interests?.message}
                  >
                    <Controller
                      name="interests"
                      control={control}
                      render={({ field }) => (
                        <div
                          id="interests"
                          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                        >
                          {interestOptions.map((interest) => {
                            const checked =
                              field.value.includes(interest);

                            return (
                              <label
                                key={interest}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm text-foreground hover:bg-muted/50"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(event) => {
                                    const next = event.target.checked
                                      ? [...field.value, interest]
                                      : field.value.filter(
                                          (item) => item !== interest
                                        );

                                    field.onChange(next);
                                  }}
                                  className="size-4 accent-emerald-700"
                                />

                                {interest}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    />
                  </FormField>

                  <div className="rounded-lg border border-border p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 accent-emerald-700"
                        {...register("newsletter")}
                      />

                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          Subscribe to the Newsletter
                        </span>

                        <span className="mt-1 block text-xs text-muted-foreground">
                          Receive occasional product updates and learning resources.
                        </span>
                      </span>
                    </label>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Selected interests:{" "}
                    {watchedInterests.length
                      ? watchedInterests.join(", ")
                      : "None"}
                  </p>
                </div>
              )}

              {/* STEP 4: Additional Information */}
              {activeStep === 3 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <FormField
                    label="Occupation"
                    htmlFor="occupation"
                    hint="Optional."
                    error={errors.occupation?.message}
                  >
                    <input
                      id="occupation"
                      placeholder="Your occupation"
                      className={inputClassName}
                      {...register("occupation", {
                        maxLength: {
                          value: 60,
                          message: "Occupation cannot exceed 60 characters.",
                        },
                      })}
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField
                      label="About You"
                      htmlFor="bio"
                      hint="Optional. Maximum 300 characters."
                      error={errors.bio?.message}
                    >
                      <textarea
                        id="bio"
                        rows={4}
                        placeholder="Write a short introduction..."
                        className={inputClassName}
                        {...register("bio", {
                          maxLength: {
                            value: 300,
                            message: "About you cannot exceed 300 characters.",
                          },
                        })}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Password"
                    htmlFor="password"
                    required
                    error={errors.password?.message}
                  >
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className={inputClassName}
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 8,
                          message: "Password must contain at least 8 characters.",
                        },
                        maxLength: {
                          value: 64,
                          message: "Password cannot exceed 64 characters.",
                        },
                        validate: (value) =>
                          (/[A-Za-z]/.test(value) &&
                            /\d/.test(value)) ||
                          "Password must contain at least one letter and one number.",
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Confirm Password"
                    htmlFor="confirmPassword"
                    required
                    error={errors.confirmPassword?.message}
                  >
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      className={inputClassName}
                      {...register("confirmPassword", {
                        required: "Please confirm your password.",
                        validate: (value) =>
                          value === password ||
                          "Passwords do not match.",
                      })}
                    />
                  </FormField>
                </div>
              )}

              {/* STEP 5: Review */}
              {activeStep === 4 && (
                <div className="space-y-5">

                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    Review your information. Use Back to make changes before submitting.
                  </div>

                  <ReviewValues />

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    This is a frontend-only demonstration. The form data is handled locally and is not sent to a server.
                  </div>
                </div>
              )}
            </div>

            {/* Form Navigation */}
            <div className="flex flex-col-reverse justify-between gap-3 border-t border-border p-5 sm:flex-row">

              <button
                type="button"
                onClick={
                  activeStep === 0
                    ? () => setShowLeaveDialog(true)
                    : goBack
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <ChevronLeft size={16} />

                {activeStep === 0 ? "Leave Form" : "Back"}
              </button>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void goNext();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  {activeStep === 3 ? "Review Details" : "Next"}

                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit Profile"}

                  <CheckCircle2 size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Form State */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Form State:{" "}
              {isDirty ? "Dirty (Modified)" : "Pristine"}
            </span>

            <button
              type="button"
              onClick={() => trigger()}
              className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              Validate Current Form
            </button>
          </div>
        </>
      )}

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Form?"
        description="All entered information will be cleared. This action cannot be undone."
        confirmLabel="Reset Form"
        cancelLabel="Keep Editing"
        onConfirm={confirmReset}
      />

      {/* Leave Confirmation */}
      <ConfirmDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        title="Leave This Form?"
        description="Your unsaved form values will be cleared. Are you sure you want to leave?"
        confirmLabel="Leave Form"
        cancelLabel="Stay Here"
        onConfirm={handleLeave}
      />
    </div>
  );
}

// Main page
function FormStudioPage() {
  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  return (
    <FormProvider {...methods}>
      <FormStudioContent />
    </FormProvider>
  );
}

export default FormStudioPage;