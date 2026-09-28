"use client";

import { useTranslations } from "next-intl";

import { ProductCard } from "./product-card";
import { ProductsPagination } from "./products-pagination";
import { ProductsTable } from "./products-table";
import { useProductsPage } from "./use-products-page";

export function ProductsList() {
  const t = useTranslations("ProductsPage");
  const { products, totalCount, page, pageCount, setPage } = useProductsPage();

  if (totalCount === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm/normal text-muted-foreground">
        {t("list.empty")}
      </p>
    );
  }

  const summary = t("pagination.summary", { page, pageCount, count: totalCount });

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <ProductsTable products={products} />
        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3">
          <p className="text-xs/normal text-muted-foreground">{summary}</p>
          <ProductsPagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 md:hidden">
        <ul aria-label={t("list.listLabel")} className="flex flex-col gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm/normal text-muted-foreground">
            {summary}
          </p>
          <ProductsPagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            className="justify-center"
          />
        </div>
      </div>
    </>
  );
}
