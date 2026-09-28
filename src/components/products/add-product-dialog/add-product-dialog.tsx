"use client";

import { useMemo, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { usePageParam } from "@/components/products/products-list/use-products-page";
import { useProductsStore } from "@/stores/products-store";

import {
  createProductFromForm,
  createStepSchemas,
  WIZARD_STEPS,
} from "./product-form";
import { AvailabilityStep } from "./steps/availability-step";
import { InformationStep } from "./steps/information-step";
import { PriceStep } from "./steps/price-step";
import { useProductForm } from "./use-product-form";
import { WizardSteps } from "./wizard-steps";

const FORM_ID = "add-product-form";
const LAST_STEP = WIZARD_STEPS.length - 1;

type AddProductDialogProps = {
  children: React.ReactElement;
};

export function AddProductDialog({ children }: AddProductDialogProps) {
  const t = useTranslations("AddProductDialog");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  /** Highest step reached so far – steps up to it can be revisited freely. */
  const [reachedStep, setReachedStep] = useState(0);
  const addProduct = useProductsStore((state) => state.addProduct);
  const [, setPage] = usePageParam();

  const stepSchemas = useMemo(() => createStepSchemas(t), [t]);

  const form = useProductForm({
    // Cumulative schema of the furthest step, so moving forward re-checks every
    // step the user could have edited on the way.
    schema: stepSchemas[reachedStep],
    onSubmit: ({ value, meta }) => {
      const targetStep = meta.targetStep ?? step + 1;
      if (targetStep > LAST_STEP) {
        addProduct(createProductFromForm(value));
        // The new product is prepended, so it lives on the first page.
        void setPage(null);
        handleOpenChange(false);
        return;
      }
      setStep(targetStep);
      setReachedStep((current) => Math.max(current, targetStep));
    },
    onInvalidStep: setStep,
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
      setStep(0);
      setReachedStep(0);
    }
  }

  function goToStep(targetStep: number) {
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }
    void form.handleSubmit({ targetStep });
  }

  const stepItems = WIZARD_STEPS.map((key) => ({
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
  }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />
      <DialogContent
        showCloseButton={false}
        className="gap-0 border-0 p-0 ring-1 ring-custom-foreground/10 max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:flex max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:flex-col max-sm:rounded-none sm:max-w-[720px]"
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-border px-4 py-6 max-sm:mx-4 max-sm:px-0 max-sm:py-4">
          <DialogTitle className="text-base leading-none font-medium">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("stepOf", { current: step + 1, total: WIZARD_STEPS.length })}
            {": "}
            {stepItems[step].title}
          </DialogDescription>
          <DialogClose
            render={<Button variant="ghost" size="icon-sm" className="-my-1.5 -mr-1.5" />}
          >
            <XIcon />
            <span className="sr-only">{t("actions.close")}</span>
          </DialogClose>
        </DialogHeader>

        <WizardSteps
          label={t("stepsLabel")}
          steps={stepItems}
          currentStep={step}
          reachedStep={reachedStep}
          onStepSelect={goToStep}
        />

        <form
          id={FORM_ID}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="px-4 py-5 max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-y-auto max-sm:py-4"
        >
          {step === 0 && <InformationStep form={form} />}
          {step === 1 && <PriceStep form={form} />}
          {step === 2 && <AvailabilityStep form={form} />}
        </form>

        <DialogFooter className="mx-0 mb-0 bg-muted p-4 max-sm:mt-auto max-sm:flex-row max-sm:justify-between sm:justify-between">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((current) => current - 1)}
              className="h-auto gap-1.5 rounded-full border-border bg-muted px-4 py-2 text-sm/normal font-medium"
            >
              <ArrowLeftIcon />
              {t("actions.back")}
            </Button>
          )}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                form={FORM_ID}
                disabled={isSubmitting}
                className="ml-auto h-auto gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm/normal font-medium text-white hover:bg-blue-700"
              >
                {step === LAST_STEP ? (
                  t("actions.submit")
                ) : (
                  <>
                    {t("actions.next")}
                    <ArrowRightIcon />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
