import { Controller, useFormContext } from "react-hook-form";

import FormField, { inputClassName } from "./FormField";

import type { FormValues } from "../types";

function ContactForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

      {/* Email */}
      <FormField
        label="Email Address"
        htmlFor="email"
        required
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClassName}
          {...register("email", {
            required: "Email address is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
        />
      </FormField>

      {/* Phone */}
      <FormField
        label="Phone Number"
        htmlFor="phone"
        required
        error={errors.phone?.message}
      >
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="10-digit phone number"
          className={inputClassName}
          {...register("phone", {
            required: "Phone number is required.",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit phone number.",
            },
          })}
        />
      </FormField>

      {/* Website */}
      <FormField
        label="Website"
        htmlFor="website"
        hint="Optional. Include https:// in the address."
        error={errors.website?.message}
      >
        <input
          id="website"
          type="url"
          placeholder="https://example.com"
          className={inputClassName}
          {...register("website", {
            validate: (value) =>
              !value ||
              /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i.test(
                value
              ) ||
              "Enter a valid URL beginning with http:// or https://.",
          })}
        />
      </FormField>

      {/* Preferred Contact */}
      <FormField
        label="Preferred Contact Method"
        htmlFor="preferredContact"
        required
        error={errors.preferredContact?.message}
      >
        <Controller
          name="preferredContact"
          control={control}
          rules={{
            required: "Choose a contact method.",
          }}
          render={({ field }) => (
            <select
              id="preferredContact"
              className={inputClassName}
              {...field}
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="SMS">SMS</option>
            </select>
          )}
        />
      </FormField>

      {/* Address */}
      <div className="md:col-span-2">
        <FormField
          label="Address"
          htmlFor="address"
          error={errors.address?.message}
        >
          <input
            id="address"
            autoComplete="street-address"
            placeholder="Street address"
            className={inputClassName}
            {...register("address", {
              maxLength: {
                value: 120,
                message: "Address cannot exceed 120 characters.",
              },
            })}
          />
        </FormField>
      </div>

      {/* City */}
      <FormField
        label="City"
        htmlFor="city"
        error={errors.city?.message}
      >
        <input
          id="city"
          autoComplete="address-level2"
          placeholder="City"
          className={inputClassName}
          {...register("city", {
            maxLength: {
              value: 50,
              message: "City cannot exceed 50 characters.",
            },
          })}
        />
      </FormField>

      {/* Postal Code */}
      <FormField
        label="Postal Code"
        htmlFor="postalCode"
        error={errors.postalCode?.message}
      >
        <input
          id="postalCode"
          inputMode="numeric"
          placeholder="6-digit postal code"
          className={inputClassName}
          {...register("postalCode", {
            validate: (value) =>
              !value ||
              /^[0-9]{6}$/.test(value) ||
              "Enter a valid 6-digit postal code.",
          })}
        />
      </FormField>

    </div>
  );
}

export default ContactForm;