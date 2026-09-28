import { useSyncExternalStore } from "react";
import { z } from "zod";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  features: z.array(z.string()),
  netPrice: z.number(),
  grossPrice: z.number(),
  vatRate: z.number(),
  currency: z.string(),
  isAvailable: z.boolean(),
  /** `null` when the product is not limited (unlimited stock). */
  stockQuantity: z.number().nullable(),
  minCartQuantity: z.number(),
  maxCartQuantity: z.number(),
  createdAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;

/** Mock catalog – manufacturers match the wizard's dropdown values. */
export const defaultProducts: Product[] = [
  {
    id: "seed-macbook-pro-14",
    name: 'MacBook Pro 14"',
    sku: "MBP14M3PRO",
    description: "",
    manufacturer: "apple",
    category: "computers",
    features: ["wifi", "bluetooth", "premium"],
    netPrice: 8129.27,
    grossPrice: 9999,
    vatRate: 23,
    currency: "PLN",
    isAvailable: true,
    stockQuantity: null,
    minCartQuantity: 1,
    maxCartQuantity: 10,
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "seed-galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    sku: "SGS24U256",
    description: "",
    manufacturer: "samsung",
    category: "phones",
    features: ["wifi", "bluetooth", "usb-c"],
    netPrice: 5121.14,
    grossPrice: 6299,
    vatRate: 23,
    currency: "PLN",
    isAvailable: true,
    stockQuantity: 45,
    minCartQuantity: 1,
    maxCartQuantity: 10,
    createdAt: "2026-09-02T10:00:00.000Z",
  },
  {
    id: "seed-sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    sku: "SNWH1000XM5",
    description: "",
    manufacturer: "microsoft",
    category: "rtv",
    features: ["bluetooth", "wireless"],
    netPrice: 1300,
    grossPrice: 1599,
    vatRate: 23,
    currency: "PLN",
    isAvailable: true,
    stockQuantity: null,
    minCartQuantity: 1,
    maxCartQuantity: 10,
    createdAt: "2026-09-03T10:00:00.000Z",
  },
  {
    id: "seed-bosch-wau28p40",
    name: "Bosch Serie 6 WAU28P40",
    sku: "BSWAU28P40",
    description: "",
    manufacturer: "hp",
    category: "agd",
    features: ["eco"],
    netPrice: 2682.11,
    grossPrice: 3299,
    vatRate: 23,
    currency: "PLN",
    isAvailable: false,
    stockQuantity: 0,
    minCartQuantity: 1,
    maxCartQuantity: 10,
    createdAt: "2026-09-04T10:00:00.000Z",
  },
  {
    id: "seed-xiaomi-smart-band-8",
    name: "Xiaomi Smart Band 8",
    sku: "XMSB8BLK",
    description: "",
    manufacturer: "dell",
    category: "accessories",
    features: ["bluetooth", "waterproof"],
    netPrice: 145.53,
    grossPrice: 179,
    vatRate: 23,
    currency: "PLN",
    isAvailable: true,
    stockQuantity: null,
    minCartQuantity: 1,
    maxCartQuantity: 10,
    createdAt: "2026-09-05T10:00:00.000Z",
  },
];

type ProductsState = {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
};

type PersistedProductsState = Pick<ProductsState, "products">;

/** Reads persisted products, dropping entries that no longer match the schema. */
function readPersistedProducts(persisted: unknown): Product[] | undefined {
  const parsed = z.object({ products: z.array(z.unknown()) }).safeParse(persisted);
  if (!parsed.success) return undefined;
  return parsed.data.products.flatMap((item) => {
    const product = productSchema.safeParse(item);
    return product.success ? [product.data] : [];
  });
}

export const productsStore = createStore<ProductsState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
    }),
    {
      name: "products",
      version: 1,
      partialize: (state): PersistedProductsState => ({
        products: state.products,
      }),
      // Bump `version` and transform here when the `Product` shape changes.
      migrate: (persistedState) => persistedState as PersistedProductsState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        products: readPersistedProducts(persistedState) ?? currentState.products,
      }),
    },
  ),
);

/**
 * The store hydrates from localStorage synchronously on the client, so its
 * state can differ from what the server rendered (the seed list). Reading it
 * through `useSyncExternalStore` with the seed list as the server snapshot lets
 * React hydrate without a mismatch and re-render with the real state right after.
 */
const serverSnapshot: ProductsState = {
  ...productsStore.getInitialState(),
  products: defaultProducts,
};

export function useProductsStore<T>(selector: (state: ProductsState) => T): T {
  return useSyncExternalStore(
    productsStore.subscribe,
    () => selector(productsStore.getState()),
    () => selector(serverSnapshot),
  );
}
