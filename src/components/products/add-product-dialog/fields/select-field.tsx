"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SelectOption } from "../product-options";
import type { ProductForm } from "../use-product-form";
import type { StringFieldName } from "./field-types";

type SelectFieldProps = {
  form: ProductForm;
  name: StringFieldName;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  /** Runs before the form value is updated and validated. */
  onValueChange?: (value: string) => void;
};

export function SelectField({
  form,
  name,
  label,
  placeholder,
  options,
  onValueChange,
}: SelectFieldProps) {
  return (
    <form.Field name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Select
              name={field.name}
              items={options}
              value={field.state.value}
              onValueChange={(value) => {
                const nextValue = value ?? "";
                onValueChange?.(nextValue);
                field.handleChange(nextValue);
              }}
            >
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={isInvalid}
                onBlur={field.handleBlur}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    </form.Field>
  );
}
