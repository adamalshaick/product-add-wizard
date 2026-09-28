import { useFormatter, useTranslations } from "next-intl";

import {
  categoryValues,
  type CategoryValue,
} from "@/components/products/add-product-dialog/product-options";
import type { Product } from "@/stores/products-store";

function isCategoryValue(value: string): value is CategoryValue {
  return (categoryValues as readonly string[]).includes(value);
}

export function useProductFormat() {
  const format = useFormatter();
  const tOptions = useTranslations("ProductOptions");

  return {
    price: (product: Pick<Product, "grossPrice" | "currency">) =>
      format.number(product.grossPrice, {
        style: "currency",
        currency: product.currency,
        currencyDisplay: "code",
      }),
    category: (value: string) =>
      isCategoryValue(value) ? tOptions(`category.${value}`) : value,
    /** `null` means unlimited stock and renders as a dash. */
    stock: (quantity: number | null) =>
      quantity === null ? "—" : format.number(quantity),
  };
}
