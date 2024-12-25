import React from 'react';
import { useOrderFormStore } from '../../store/useOrderFormStore';
import { cn } from '../../lib/utils';

export function OrderProgress() {
  const { currentStep, isStepComplete } = useOrderFormStore();
  
  const steps = [
    { id: 'details', label: 'Details', description: 'Basic information' },
    { id: 'music', label: 'Music', description: 'Background music' },
    { id: 'cover', label: 'Cover', description: 'Cover image' },
    { id: 'scenery', label: 'Scenery', description: 'Scene transitions' },
    { id: 'verse', label: 'Verse', description: 'Closing verse' },
    { id: 'media', label: 'Media', description: 'Photos & videos' },
    { id: 'review', label: 'Review', description: 'Final review' },
  ];

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.id}
                className={cn(
                  stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
                  'relative'
                )}
              >
                {isStepComplete(step.id) ? (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-indigo-600" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                )}
                <div
                  className={cn(
                    'relative w-8 h-8 flex items-center justify-center rounded-full',
                    currentStep === step.id
                      ? 'bg-white border-2 border-indigo-600'
                      : isStepComplete(step.id)
                      ? 'bg-indigo-600'
                      : 'bg-white border-2 border-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      currentStep === step.id ? 'bg-indigo-600' : 'bg-transparent'
                    )}
                  />
                  <span className="sr-only">{step.label}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}