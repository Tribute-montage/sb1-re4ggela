import React from 'react';
import { cn } from '../../lib/utils';
import { BRAND } from '../../lib/theme/colors';

export const ORDER_STEPS = [
  { id: 'details', label: 'Order Details', color: BRAND.green },
  { id: 'music', label: 'Background Music', color: BRAND.blue },
  { id: 'cover', label: 'Cover Image', color: '#9B59B6' },
  { id: 'scenery', label: 'Scenery', color: '#1ABC9C' },
  { id: 'verse', label: 'Closing Verse', color: '#E74C3C' },
  { id: 'media', label: 'Media Upload', color: '#F1C40F' },
  { id: 'review', label: 'Review Order', color: '#27AE60' },
] as const;

export type OrderStep = typeof ORDER_STEPS[number]['id'];

interface OrderStepTabsProps {
  currentStep: OrderStep;
  onStepSelect: (step: OrderStep) => void;
  isStepComplete: (step: OrderStep) => boolean;
  canAccessStep: (step: OrderStep) => boolean;
}

export function OrderStepTabs({
  currentStep,
  onStepSelect,
  isStepComplete,
  canAccessStep,
}: OrderStepTabsProps) {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Order steps">
      {ORDER_STEPS.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = isStepComplete(step.id);
        const isAccessible = canAccessStep(step.id);

        return (
          <button
            key={step.id}
            onClick={() => isAccessible && onStepSelect(step.id)}
            disabled={!isAccessible}
            className={cn(
              "relative px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              isActive && "text-white shadow-lg",
              isCompleted && !isActive && "text-gray-700 bg-gray-50 border border-gray-200",
              !isActive && !isCompleted && "text-gray-600 hover:bg-gray-50 border border-gray-200",
              !isAccessible && "opacity-50 cursor-not-allowed",
              "hover:transform hover:-translate-y-0.5 hover:shadow-md"
            )}
            style={{
              backgroundColor: isActive ? step.color : undefined,
              borderColor: isCompleted ? step.color : undefined,
              color: isCompleted && !isActive ? step.color : undefined,
            }}
          >
            <span className="flex items-center">
              {isCompleted && !isActive && (
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {step.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}