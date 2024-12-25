import React from 'react';
import { cn } from '../../lib/utils';

interface OrderProgressBarProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

export function OrderProgressBar({ currentStep, steps }: OrderProgressBarProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step.title} className="md:flex-1">
            <div
              className={cn(
                "group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4",
                index + 1 <= currentStep
                  ? "border-indigo-600"
                  : "border-gray-200"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  index + 1 <= currentStep
                    ? "text-indigo-600"
                    : "text-gray-500"
                )}
              >
                STEP {index + 1}
              </span>
              <span className="text-sm font-medium">{step.title}</span>
              <span className="text-sm text-gray-500">{step.description}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}