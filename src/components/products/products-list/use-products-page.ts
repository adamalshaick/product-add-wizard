import { useMemo } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useProductsStore } from "@/stores/products-store";

import { PAGE_SIZE } from "./constants";

const pageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ history: "push" });

/** Current page from the URL. Setting `null` clears it (= page 1). */
export function usePageParam() {
  return useQueryState("page", pageParser);
}

export function useProductsPage() {
  const [requestedPage, setPage] = usePageParam();
  const products = useProductsStore((state) => state.products);

  const totalCount = products.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(Math.max(requestedPage, 1), pageCount);

  const pageProducts = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page],
  );

  return { products: pageProducts, totalCount, page, pageCount, setPage };
}
