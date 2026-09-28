"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { FieldGroup } from "@/components/ui/field";

import { SelectField } from "../fields/select-field";
import { TextField } from "../fields/text-field";
import { grossFromNet, netFromGross, parseAmountLoose } from "../product-form";
import { currencyOptions, vatRateOptions } from "../product-options";
import type { ProductForm } from "../use-product-form";

type PriceStepProps = {
  form: ProductForm;
};

type PriceSource = "net" | "gross";

export function PriceStep({ form }: PriceStepProps) {
  const t = useTranslations("AddProductDialog.price");
  /** Which amount the user typed last – the other one is derived from it. */
  const priceSource = useRef<PriceSource>("net");

  // Derived values are written without touching or validating the target field;
  // the change that triggered the sync validates the whole form right after.
  const setDerived = (name: "netPrice" | "grossPrice", value: string) =>
    form.setFieldValue(name, value, { dontUpdateMeta: true, dontValidate: true });

  function syncGrossFromNet(net: string, vatRate: string) {
    if (net.trim() === "") {
      setDerived("grossPrice", "");
      return;
    }
    const amount = parseAmountLoose(net);
    if (Number.isNaN(amount)) return;
    setDerived("grossPrice", grossFromNet(amount, Number(vatRate)));
  }

  function syncNetFromGross(gross: string, vatRate: string) {
    if (gross.trim() === "") {
      setDerived("netPrice", "");
      return;
    }
    const amount = parseAmountLoose(gross);
    if (Number.isNaN(amount)) return;
    setDerived("netPrice", netFromGross(amount, Number(vatRate)));
  }

  function handleVatRateChange(vatRate: string) {
    const net = form.getFieldValue("netPrice");
    const gross = form.getFieldValue("grossPrice");
    if (priceSource.current === "gross" && gross !== "") {
      syncNetFromGross(gross, vatRate);
    } else if (net !== "") {
      syncGrossFromNet(net, vatRate);
    } else if (gross !== "") {
      syncNetFromGross(gross, vatRate);
    }
  }

  return (
    <FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="netPrice"
          label={t("netPrice")}
          placeholder={t("amountPlaceholder")}
          inputMode="decimal"
          onValueChange={(value) => {
            priceSource.current = "net";
            syncGrossFromNet(value, form.getFieldValue("vatRate"));
          }}
        />
        <TextField
          form={form}
          name="grossPrice"
          label={t("grossPrice")}
          placeholder={t("amountPlaceholder")}
          inputMode="decimal"
          onValueChange={(value) => {
            priceSource.current = "gross";
            syncNetFromGross(value, form.getFieldValue("vatRate"));
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          form={form}
          name="vatRate"
          label={t("vatRate")}
          options={vatRateOptions}
          onValueChange={handleVatRateChange}
        />
        <SelectField
          form={form}
          name="currency"
          label={t("currency")}
          options={currencyOptions}
        />
      </div>
    </FieldGroup>
  );
}
