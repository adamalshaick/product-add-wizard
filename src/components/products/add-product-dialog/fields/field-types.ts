import type { ProductFormValues } from "../product-form";

/** Names of wizard fields whose value is a string (inputs, textareas, selects). */
export type StringFieldName = {
  [K in keyof ProductFormValues]: ProductFormValues[K] extends string ? K : never;
}[keyof ProductFormValues];
