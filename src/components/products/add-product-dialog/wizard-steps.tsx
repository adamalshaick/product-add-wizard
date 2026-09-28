"use client";

import { cn } from "cn";
import { CheckIcon } from "lucide-react";

export type WizardStepItem = {
  title: string;
  description: string;
};

type WizardStepsProps = {
  label: string;
  steps: readonly WizardStepItem[];
  currentStep: number;
  /** Highest step index the user has reached – every step before it is validated. */
  reachedStep: number;
  onStepSelect?: (index: number) => void;
};

export function WizardSteps({
  label,
  steps,
  currentStep,
  reachedStep,
  onStepSelect,
}: WizardStepsProps) {
  return (
    <ol
      className="flex items-center gap-4 border-b border-border px-4 py-3 max-sm:mx-4 max-sm:items-start max-sm:justify-between max-sm:gap-0 max-sm:px-0 max-sm:py-6"
      aria-label={label}
    >
      {steps.map((step, index) => {
        const isCurrent = index === currentStep;
        const isCompleted = !isCurrent && index < reachedStep;
        const isActive = index <= reachedStep;
        const isSelectable = !isCurrent && index <= reachedStep && !!onStepSelect;

        return (
          <li
            key={step.title}
            className="flex items-center gap-4 max-sm:min-w-[5.125rem]"
          >
            <button
              type="button"
              disabled={!isSelectable}
              onClick={() => onStepSelect?.(index)}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default max-sm:flex-col max-sm:items-start",
                isSelectable && "cursor-pointer",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm/normal font-semibold transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-accent text-muted-foreground ring-1 ring-border ring-inset",
                )}
              >
                {isCompleted ? <CheckIcon className="size-4" /> : index + 1}
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm/normal font-medium whitespace-nowrap",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
                <span className="text-xs/normal font-normal whitespace-nowrap text-muted-foreground">
                  {step.description}
                </span>
              </span>
            </button>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-17 shrink-0 transition-colors max-sm:hidden",
                  index < reachedStep ? "bg-blue-600" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
