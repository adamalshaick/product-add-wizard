"use client";

import { useTranslations } from "next-intl";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import {
  categoryValues,
  featureValues,
  manufacturerOptions,
} from "../product-options";
import type { ProductForm } from "../use-product-form";

type InformationStepProps = {
  form: ProductForm;
};

export function InformationStep({ form }: InformationStepProps) {
  const t = useTranslations("AddProductDialog.information");
  const tOptions = useTranslations("ProductOptions");

  const categoryOptions = categoryValues.map((value) => ({
    value,
    label: tOptions(`category.${value}`),
  }));

  return (
    <FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="name"
          label={t("name")}
          placeholder={t("namePlaceholder")}
        />
        <TextField
          form={form}
          name="sku"
          label={t("sku")}
          placeholder={t("skuPlaceholder")}
        />
      </div>

      <TextField
        form={form}
        name="description"
        label={t("description")}
        placeholder={t("descriptionPlaceholder")}
        multiline
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          form={form}
          name="manufacturer"
          label={t("manufacturer")}
          placeholder={t("manufacturerPlaceholder")}
          options={manufacturerOptions}
        />
        <SelectField
          form={form}
          name="category"
          label={t("category")}
          placeholder={t("categoryPlaceholder")}
          options={categoryOptions}
        />
      </div>

      <form.Field name="features">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel id={`${field.name}-label`}>{t("features")}</FieldLabel>
              <ToggleGroup
                multiple
                aria-labelledby={`${field.name}-label`}
                aria-invalid={isInvalid}
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value as string[]);
                  field.handleBlur();
                }}
                className="w-full flex-wrap gap-2"
              >
                {featureValues.map((value) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    className="h-auto rounded-full border border-border px-2 py-0.5 text-sm/normal font-normal text-muted-foreground aria-pressed:border-blue-600 aria-pressed:bg-blue-600 aria-pressed:text-white"
                  >
                    {tOptions(`feature.${value}`)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
    </FieldGroup>
  );
}
