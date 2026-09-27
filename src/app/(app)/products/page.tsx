import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const t = useTranslations("ProductsPage");
  const productCount = 0;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl/normal font-semibold text-foreground">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm/normal font-normal text-muted-foreground">
          {t("count", { count: productCount })}
        </p>
      </div>
      <Button
        size="lg"
        className="rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700"
      >
        <PlusIcon />
        {t("addProduct")}
      </Button>
    </div>
  );
}
