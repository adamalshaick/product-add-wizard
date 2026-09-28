import { revalidateLogic, useForm } from "@tanstack/react-form";

import {
  productFormDefaultValues,
  STEP_FIELDS,
  WIZARD_STEPS,
  type ProductFormValues,
  type StepSchema,
} from "./product-form";

export type SubmitMeta = {
  /** Step to move to after a successful validation (defaults to the next one). */
  targetStep?: number;
};

type UseProductFormOptions = {
  /** Cumulative schema of the furthest step reached – covers every step before it too. */
  schema: StepSchema;
  onSubmit: (props: { value: ProductFormValues; meta: SubmitMeta }) => void;
  /** Called with the index of the first step that has errors after a failed submit. */
  onInvalidStep: (stepIndex: number) => void;
};

export function useProductForm({
  schema,
  onSubmit,
  onInvalidStep,
}: UseProductFormOptions) {
  return useForm({
    defaultValues: productFormDefaultValues,
    // Validate on "submit" (= moving forward); after the first attempt re-validate
    // on every change so errors disappear as soon as they are fixed.
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: schema,
    },
    onSubmitMeta: {} as SubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit({ value, meta }),
    onSubmitInvalid: ({ formApi }) => {
      const failingStep = WIZARD_STEPS.findIndex((step) =>
        STEP_FIELDS[step].some(
          (name) => (formApi.getFieldMeta(name)?.errors.length ?? 0) > 0,
        ),
      );
      if (failingStep === -1) return;

      // Errors of unmounted fields are recorded by the form-level validator but
      // only shown for touched fields – touch them so they appear after the jump.
      for (const name of STEP_FIELDS[WIZARD_STEPS[failingStep]]) {
        if ((formApi.getFieldMeta(name)?.errors.length ?? 0) > 0) {
          formApi.setFieldMeta(name, (prev) => ({ ...prev, isTouched: true }));
        }
      }
      onInvalidStep(failingStep);
    },
  });
}

export type ProductForm = ReturnType<typeof useProductForm>;
