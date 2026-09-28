"use client";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

import { TextField } from "../fields/text-field";
import type { ProductForm } from "../use-product-form";

type AvailabilityStepProps = {
  form: ProductForm;
};

export function AvailabilityStep({ form }: AvailabilityStepProps) {
  const t = useTranslations("AddProductDialog.availability");

  return (
    <FieldGroup>
      <form.Field name="isAvailable">
        {(field) => (
          <Field orientation="horizontal">
            <Switch
              id={field.name}
              name={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
              className="data-checked:bg-blue-600"
            />
            <FieldLabel htmlFor={field.name}>{t("isAvailable")}</FieldLabel>
          </Field>
        )}
      </form.Field>

      <FieldSeparator />

      <form.Field name="isLimited">
        {(field) => (
          <Field orientation="horizontal">
            <Checkbox
              id={field.name}
              name={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => {
                if (!checked) {
                  form.setFieldValue("stockQuantity", "", {
                    dontUpdateMeta: true,
                    dontValidate: true,
                  });
                }
                field.handleChange(checked);
              }}
              className="data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white"
            />
            <FieldLabel htmlFor={field.name}>{t("isLimited")}</FieldLabel>
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.values.isLimited}>
        {(isLimited) =>
          isLimited && (
            <TextField
              form={form}
              name="stockQuantity"
              label={t("stockQuantity")}
              placeholder={t("quantityPlaceholder")}
              inputMode="numeric"
            />
          )
        }
      </form.Subscribe>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend className="mb-4 text-base/normal font-medium">
          {t("cartLimits")}
        </FieldLegend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            form={form}
            name="minCartQuantity"
            label={t("minCartQuantity")}
            placeholder={t("quantityPlaceholder")}
            inputMode="numeric"
          />
          <TextField
            form={form}
            name="maxCartQuantity"
            label={t("maxCartQuantity")}
            placeholder={t("quantityPlaceholder")}
            inputMode="numeric"
          />
        </div>
      </FieldSet>
    </FieldGroup>
  );
}
