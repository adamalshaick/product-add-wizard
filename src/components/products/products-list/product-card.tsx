import { useTranslations } from "next-intl";

import type { Product } from "@/stores/products-store";

import { ProductStatusBadge } from "./product-status-badge";
import { useProductFormat } from "./use-product-format";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("ProductsPage.list.columns");
  const formatProduct = useProductFormat();

  const details = [
    { label: t("category"), value: formatProduct.category(product.category) },
    {
      label: t("grossPrice"),
      value: formatProduct.price(product),
      className: "font-semibold",
    },
    { label: t("stock"), value: formatProduct.stock(product.stockQuantity) },
  ];

  return (
    <li className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base/normal font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-sm/normal text-muted-foreground">
            {product.sku}
          </p>
        </div>
        <ProductStatusBadge isAvailable={product.isAvailable} />
      </div>

      <dl className="mt-2 grid grid-cols-3 gap-4 rounded-lg bg-muted p-3">
        {details.map((detail) => (
          <div key={detail.label} className="min-w-0">
            <dt className="text-xs/normal text-muted-foreground">
              {detail.label}
            </dt>
            <dd
              className={`mt-1 truncate text-sm/normal font-medium text-foreground ${detail.className ?? ""}`}
            >
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
