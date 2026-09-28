"use client";

import { useTranslations } from "next-intl";

import { useProductsStore } from "@/stores/products-store";

export function ProductsCount({ className }: { className?: string }) {
  const t = useTranslations("ProductsPage");
  const count = useProductsStore((state) => state.products.length);

  return <p className={className}>{t("count", { count })}</p>;
}
