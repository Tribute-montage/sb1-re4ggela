import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderStep } from '../components/orders/OrderStepTabs';
import type { OrderDetailsForm } from '../lib/validation/schemas/orderSchema';

interface OrderFormState {
  currentStep: OrderStep;
  completedSteps: OrderStep[];
  orderDetails: Partial<OrderDetailsForm>;
  orderId: string | null;
  setCurrentStep: (step: OrderStep) => void;
  markStepComplete: (step: OrderStep) => void;
  updateOrderDetails: (details: Partial<OrderDetailsForm>) => void;
  setOrderId: (id: string) => void;
  resetForm: () => void;
  isStepComplete: (step: OrderStep) => boolean;
  canAccessStep: (step: OrderStep) => boolean;
  canSubmitOrder: () => boolean;
}

const initialState = {
  currentStep: 'details' as OrderStep,
  completedSteps: [] as OrderStep[],
  orderDetails: {},
  orderId: null,
};

export const useOrderFormStore = create<OrderFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      markStepComplete: (step) => set((state) => ({
        completedSteps: [...new Set([...state.completedSteps, step])]
      })),

      updateOrderDetails: (details) => set((state) => ({
        orderDetails: { ...state.orderDetails, ...details }
      })),

      setOrderId: (id) => set({ orderId: id }),

      resetForm: () => set(initialState),

      isStepComplete: (step) => {
        const state = get();
        return state.completedSteps.includes(step);
      },

      canAccessStep: (step) => {
        // All steps are accessible
        return true;
      },

      canSubmitOrder: () => {
        const state = get();
        const requiredSteps = ['details'];
        return requiredSteps.every(step => state.completedSteps.includes(step as OrderStep));
      },
    }),
    {
      name: 'order-form-storage',
    }
  )
);