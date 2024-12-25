import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderStepTabs } from '../../components/orders/OrderStepTabs';
import { OrderDetailsForm } from '../../components/orders/form/OrderDetailsForm';
import { BackgroundMusicStep } from '../../components/orders/customization/BackgroundMusicStep';
import { CoverImageStep } from '../../components/orders/customization/CoverImageStep';
import { SceneryStep } from '../../components/orders/customization/SceneryStep';
import { ClosingVerseStep } from '../../components/orders/customization/ClosingVerseStep';
import { MediaUploadStep } from '../../components/orders/MediaUploadStep';
import { OrderReviewStep } from '../../components/orders/review/OrderReviewStep';
import { useOrderFormStore } from '../../store/useOrderFormStore';
import { useClients } from '../../hooks/admin/useClients';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';
import type { OrderDetailsForm as OrderDetailsFormType } from '../../lib/validation/schemas/orderSchema';
import type { Asset } from '../../types/order';

export function NewOrder() {
  const navigate = useNavigate();
  const { clients, loading: loadingClients } = useClients();
  const { 
    currentStep,
    setCurrentStep,
    updateOrderDetails,
    markStepComplete,
    isStepComplete,
    canAccessStep,
    orderId,
    setOrderId,
  } = useOrderFormStore();

  const handleDetailsSubmit = async (data: OrderDetailsFormType) => {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      setOrderId(order.id);
      updateOrderDetails(data);
      markStepComplete('details');
      setCurrentStep('music');
      toast.success('Order details saved');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order details');
    }
  };

  const handleAssetSelect = (type: Asset['type'], asset: Asset | null) => {
    updateOrderDetails({ [type]: asset?.id });
    markStepComplete(type as any);
    
    // Move to next step
    const currentIndex = ORDER_STEPS.findIndex(step => step.id === currentStep);
    const nextStep = ORDER_STEPS[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'details':
        return (
          <OrderDetailsForm
            onSubmit={handleDetailsSubmit}
            clients={clients}
          />
        );
      case 'music':
        return (
          <BackgroundMusicStep
            selectedId={undefined}
            onSelect={(asset) => handleAssetSelect('music', asset)}
            onNext={() => setCurrentStep('cover')}
            onBack={() => setCurrentStep('details')}
          />
        );
      case 'cover':
        return (
          <CoverImageStep
            selectedId={undefined}
            onSelect={(asset) => handleAssetSelect('cover', asset)}
            onNext={() => setCurrentStep('scenery')}
            onBack={() => setCurrentStep('music')}
          />
        );
      case 'scenery':
        return (
          <SceneryStep
            selectedId={undefined}
            onSelect={(asset) => handleAssetSelect('scenery', asset)}
            onNext={() => setCurrentStep('verse')}
            onBack={() => setCurrentStep('cover')}
          />
        );
      case 'verse':
        return (
          <ClosingVerseStep
            selectedId={undefined}
            onSelect={(asset) => handleAssetSelect('verse', asset)}
            onNext={() => setCurrentStep('media')}
            onBack={() => setCurrentStep('scenery')}
          />
        );
      case 'media':
        return (
          <MediaUploadStep
            orderId={orderId!}
            onComplete={() => {
              markStepComplete('media');
              setCurrentStep('review');
            }}
            onBack={() => setCurrentStep('verse')}
          />
        );
      case 'review':
        return <OrderReviewStep />;
      default:
        return null;
    }
  };

  if (loadingClients) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <OrderStepTabs
              currentStep={currentStep}
              onStepSelect={setCurrentStep}
              isStepComplete={isStepComplete}
              canAccessStep={canAccessStep}
            />
          </div>

          <div className="bg-white shadow-xl rounded-xl border border-gray-100">
            <div className="p-8">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}