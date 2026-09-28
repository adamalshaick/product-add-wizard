"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { ProductForm } from "../use-product-form";
import type { StringFieldName } from "./field-types";

type TextFieldProps = {
  form: ProductForm;
  name: StringFieldName;
  label: string;
  placeholder?: string;
  inputMode?: React.ComponentProps<"input">["inputMode"];
  /** Renders a textarea instead of an input. */
  multiline?: boolean;
  /** Runs before the form value is updated and validated. */
  onValueChange?: (value: string) => void;
};

export function TextField({
  form,
  name,
  label,
  placeholder,
  inputMode,
  multiline = false,
  onValueChange,
}: TextFieldProps) {
  return (
    <form.Field name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        const handleChange = (value: string) => {
          onValueChange?.(value);
          field.handleChange(value);
        };

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {multiline ? (
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => handleChange(event.target.value)}
                placeholder={placeholder}
                rows={3}
                aria-invalid={isInvalid}
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => handleChange(event.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                autoComplete="off"
                aria-invalid={isInvalid}
              />
            )}
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    </form.Field>
  );
}
