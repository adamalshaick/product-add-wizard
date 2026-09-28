import { cn } from "cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

export function getPageRange(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  const items: PageItem[] = [1];

  if (start > 2) items.push("start-ellipsis");
  for (let current = start; current <= end; current++) items.push(current);
  if (end < pageCount - 1) items.push("end-ellipsis");

  items.push(pageCount);
  return items;
}

type ProductsPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function ProductsPagination({
  page,
  pageCount,
  onPageChange,
  className,
}: ProductsPaginationProps) {
  const t = useTranslations("ProductsPage.pagination");

  return (
    <nav
      aria-label={t("label")}
      className={cn("flex items-center gap-2", className)}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="text-sm/normal font-medium"
      >
        <ChevronLeftIcon data-icon="inline-start" />
        {t("previous")}
      </Button>

      <ol className="flex items-center gap-1">
        {getPageRange(page, pageCount).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-current={item === page ? "page" : undefined}
                aria-label={t("goToPage", { page: item })}
                onClick={() => onPageChange(item)}
                className={cn(
                  "text-sm/normal font-medium",
                  item === page &&
                    "bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
                )}
              >
                {item}
              </Button>
            </li>
          ) : (
            <li
              key={item}
              aria-hidden
              className="flex size-8 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </li>
          ),
        )}
      </ol>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="text-sm/normal font-medium"
      >
        {t("next")}
        <ChevronRightIcon data-icon="inline-end" />
      </Button>
    </nav>
  );
}
