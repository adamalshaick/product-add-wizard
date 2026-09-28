import type { useTranslations } from "next-intl";
import { z } from "zod";

import type { Product } from "@/stores/products-store";

import { categoryValues, featureValues } from "./product-options";

export const WIZARD_STEPS = ["information", "price", "availability"] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

/**
 * Loose shape describing every field of the wizard. Each step schema is built
 * on top of it so all steps share the same input type – TanStack Form requires
 * the validator to accept the whole form value, not just the current step.
 */
const baseShape = {
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  features: z.array(z.string()),
  netPrice: z.string(),
  grossPrice: z.string(),
  vatRate: z.string(),
  currency: z.string(),
  isAvailable: z.boolean(),
  isLimited: z.boolean(),
  stockQuantity: z.string(),
  minCartQuantity: z.string(),
  maxCartQuantity: z.string(),
};

export type ProductFormValues = z.input<z.ZodObject<typeof baseShape>>;

export const productFormDefaultValues: ProductFormValues = {
  name: "",
  sku: "",
  description: "",
  manufacturer: "",
  category: "",
  features: [],
  netPrice: "",
  grossPrice: "",
  vatRate: "23",
  currency: "PLN",
  isAvailable: true,
  isLimited: false,
  stockQuantity: "",
  minCartQuantity: "1",
  maxCartQuantity: "10",
};

/** Fields rendered on each step – used to jump to the first step with errors. */
export const STEP_FIELDS: Record<
  WizardStep,
  ReadonlyArray<keyof ProductFormValues>
> = {
  information: ["name", "sku", "description", "manufacturer", "category", "features"],
  price: ["netPrice", "grossPrice", "vatRate", "currency"],
  availability: [
    "isAvailable",
    "isLimited",
    "stockQuantity",
    "minCartQuantity",
    "maxCartQuantity",
  ],
};

// ---------------------------------------------------------------- amounts

/** Parses a typed amount ("12,50" or "12.50"). Returns NaN when invalid. */
export function parseAmount(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

/** Like `parseAmount`, but tolerates a trailing separator while typing ("12."). */
export function parseAmountLoose(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d*)?$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

/** Money math happens in integer grosze so half-grosz results round correctly. */
export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function formatCents(cents: number) {
  return (cents / 100).toFixed(2);
}

/** brutto = netto × (1 + VAT / 100) */
export function grossFromNet(net: number, vatRate: number) {
  return formatCents(Math.round((toCents(net) * (100 + vatRate)) / 100));
}

/** netto = brutto / (1 + VAT / 100) */
export function netFromGross(gross: number, vatRate: number) {
  return formatCents(Math.round((toCents(gross) * 100) / (100 + vatRate)));
}

// ---------------------------------------------------------------- schemas

type Translator = ReturnType<typeof useTranslations<"AddProductDialog">>;

/**
 * Validation is composed from refinements that pass on an empty value instead
 * of `abort: true` – an aborted check would make Zod skip the object-level
 * `superRefine` (cross-field rules) for the whole form.
 */
const requiredText = (message: string) =>
  z.string().trim().refine((value) => value.length > 0, message);

const amount = (requiredMessage: string, invalidMessage: string) =>
  requiredText(requiredMessage).refine(
    (value) => value === "" || parseAmount(value) >= 0,
    invalidMessage,
  );

const nonNegativeInteger = (requiredMessage: string, invalidMessage: string) =>
  requiredText(requiredMessage).refine(
    (value) => value === "" || /^\d+$/.test(value),
    invalidMessage,
  );

export function createStepSchemas(t: Translator) {
  const informationShape = {
    name: requiredText(t("validation.nameRequired")).refine(
      (value) => value === "" || value.length >= 3,
      t("validation.nameMin"),
    ),
    sku: requiredText(t("validation.skuRequired"))
      .refine((value) => value.length <= 24, t("validation.skuMax"))
      .refine(
        (value) => value === "" || /^[a-zA-Z0-9]+$/.test(value),
        t("validation.skuAlphanumeric"),
      ),
    description: z.string(),
    manufacturer: z.string().min(1, t("validation.manufacturerRequired")),
    category: z.enum(categoryValues, t("validation.categoryRequired")),
    features: z
      .array(z.enum(featureValues))
      .min(1, t("validation.featuresMin")),
  };

  const priceShape = {
    netPrice: amount(
      t("validation.netPriceRequired"),
      t("validation.netPriceInvalid"),
    ),
    grossPrice: amount(
      t("validation.grossPriceRequired"),
      t("validation.grossPriceInvalid"),
    ),
    vatRate: z.string().min(1, t("validation.vatRateRequired")),
    currency: z.string().min(1, t("validation.currencyRequired")),
  };

  const availabilityShape = {
    isAvailable: z.boolean(),
    isLimited: z.boolean(),
    stockQuantity: z.string(),
    minCartQuantity: nonNegativeInteger(
      t("validation.minCartQuantityRequired"),
      t("validation.quantityInteger"),
    ),
    maxCartQuantity: nonNegativeInteger(
      t("validation.maxCartQuantityRequired"),
      t("validation.quantityInteger"),
    ),
  };

  const informationSchema = z.object({ ...baseShape, ...informationShape });

  const priceSchema = z.object({
    ...baseShape,
    ...informationShape,
    ...priceShape,
  });

  const availabilitySchema = z
    .object({
      ...baseShape,
      ...informationShape,
      ...priceShape,
      ...availabilityShape,
    })
    .superRefine((value, ctx) => {
      if (value.isLimited) {
        const stock = value.stockQuantity.trim();
        if (stock === "") {
          ctx.addIssue({
            code: "custom",
            path: ["stockQuantity"],
            message: t("validation.stockQuantityRequired"),
          });
        } else if (!/^\d+$/.test(stock)) {
          ctx.addIssue({
            code: "custom",
            path: ["stockQuantity"],
            message: t("validation.quantityInteger"),
          });
        }
      }

      const min = Number(value.minCartQuantity);
      const max = Number(value.maxCartQuantity);
      if (Number.isInteger(min) && Number.isInteger(max) && min > max) {
        ctx.addIssue({
          code: "custom",
          path: ["minCartQuantity"],
          message: t("validation.minCartQuantityTooHigh"),
        });
        ctx.addIssue({
          code: "custom",
          path: ["maxCartQuantity"],
          message: t("validation.maxCartQuantityTooLow"),
        });
      }
    });

  return [informationSchema, priceSchema, availabilitySchema] as const;
}

export type StepSchema = ReturnType<typeof createStepSchemas>[number];

// ---------------------------------------------------------------- mapping

function createId() {
  const cryptoApi = globalThis.crypto;
  // `randomUUID` exists only in secure contexts (https / localhost).
  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Turns validated wizard values into a catalog product. */
export function createProductFromForm(values: ProductFormValues): Product {
  return {
    id: createId(),
    name: values.name.trim(),
    sku: values.sku.trim(),
    description: values.description.trim(),
    manufacturer: values.manufacturer,
    category: values.category,
    features: values.features,
    netPrice: parseAmount(values.netPrice),
    grossPrice: parseAmount(values.grossPrice),
    vatRate: Number(values.vatRate),
    currency: values.currency,
    isAvailable: values.isAvailable,
    stockQuantity: values.isLimited ? Number(values.stockQuantity) : null,
    minCartQuantity: Number(values.minCartQuantity),
    maxCartQuantity: Number(values.maxCartQuantity),
    createdAt: new Date().toISOString(),
  };
}
