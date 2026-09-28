import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AddProductDialog } from "@/components/products/add-product-dialog/add-product-dialog";
import { ProductsCount } from "@/components/products/products-count";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const t = useTranslations("ProductsPage");

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl/normal font-semibold text-foreground">
          {t("title")}
        </h1>
        <ProductsCount className="mt-1 text-sm/normal font-normal text-muted-foreground" />
      </div>
      <AddProductDialog>
        <Button
          size="lg"
          className="rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700"
        >
          <PlusIcon />
          {t("addProduct")}
        </Button>
      </AddProductDialog>
    </div>
  );
}
