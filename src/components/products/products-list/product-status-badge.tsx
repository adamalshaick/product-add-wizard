import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

type ProductStatusBadgeProps = {
  isAvailable: boolean;
};

export function ProductStatusBadge({ isAvailable }: ProductStatusBadgeProps) {
  const t = useTranslations("ProductsPage.list.status");

  return (
    <Badge
      variant={isAvailable ? "success" : "destructive"}
      className="h-6 px-2.5"
    >
      {isAvailable ? t("available") : t("unavailable")}
    </Badge>
  );
}
