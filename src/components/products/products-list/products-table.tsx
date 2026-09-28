import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/stores/products-store";

import { ProductStatusBadge } from "./product-status-badge";
import { useProductFormat } from "./use-product-format";

type ProductsTableProps = {
  products: Product[];
};

const headClassName =
  "h-auto px-5 py-3.5 text-sm/normal font-normal text-muted-foreground";
const cellClassName = "px-5 py-4 text-sm/normal";

export function ProductsTable({ products }: ProductsTableProps) {
  const t = useTranslations("ProductsPage.list");
  const formatProduct = useProductFormat();

  return (
    <Table aria-label={t("listLabel")}>
      <TableHeader className="bg-muted/50">
        <TableRow className="hover:bg-transparent">
          <TableHead className={`${headClassName} w-[30%]`}>
            {t("columns.name")}
          </TableHead>
          <TableHead className={headClassName}>{t("columns.sku")}</TableHead>
          <TableHead className={headClassName}>
            {t("columns.category")}
          </TableHead>
          <TableHead className={headClassName}>
            {t("columns.grossPrice")}
          </TableHead>
          <TableHead className={headClassName}>{t("columns.status")}</TableHead>
          <TableHead className={headClassName}>{t("columns.stock")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className={`${cellClassName} font-medium text-foreground`}>
              {product.name}
            </TableCell>
            <TableCell className={`${cellClassName} text-muted-foreground`}>
              {product.sku}
            </TableCell>
            <TableCell className={`${cellClassName} text-muted-foreground`}>
              {formatProduct.category(product.category)}
            </TableCell>
            <TableCell className={`${cellClassName} font-medium text-foreground`}>
              {formatProduct.price(product)}
            </TableCell>
            <TableCell className={cellClassName}>
              <ProductStatusBadge isAvailable={product.isAvailable} />
            </TableCell>
            <TableCell className={`${cellClassName} text-foreground`}>
              {formatProduct.stock(product.stockQuantity)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
