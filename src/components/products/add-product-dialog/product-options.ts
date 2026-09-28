export type SelectOption = { value: string; label: string };

/** Brand names are not translated, so they carry their labels directly. */
export const manufacturerOptions: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "microsoft", label: "Microsoft" },
  { value: "samsung", label: "Samsung" },
  { value: "dell", label: "Dell" },
  { value: "hp", label: "HP" },
];

/** Labels live in messages under `ProductOptions.category.<value>`. */
export const categoryValues = [
  "computers",
  "phones",
  "rtv",
  "agd",
  "accessories",
] as const;
export type CategoryValue = (typeof categoryValues)[number];

/** Labels live in messages under `ProductOptions.feature.<value>`. */
export const featureValues = [
  "bluetooth",
  "wifi",
  "usb-c",
  "waterproof",
  "wireless",
  "eco",
  "premium",
] as const;
export type FeatureValue = (typeof featureValues)[number];

export const vatRateOptions: SelectOption[] = [
  { value: "23", label: "23%" },
  { value: "8", label: "8%" },
  { value: "5", label: "5%" },
  { value: "0", label: "0%" },
];

export const currencyOptions: SelectOption[] = [
  { value: "PLN", label: "PLN" },
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
];
