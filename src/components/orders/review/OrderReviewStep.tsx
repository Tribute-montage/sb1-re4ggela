import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderFormStore } from '../../../store/useOrderFormStore';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

export function OrderReviewStep() {
  const navigate = useNavigate();
  const { orderDetails, canSubmitOrder } = useOrderFormStore();

  const handleSubmit = async () => {
    if (!canSubmitOrder()) {
      toast.error('Please complete the required order details before submitting');
      return;
    }

    try {
      // Submit order logic here
      toast.success('Order submitted successfully');
      navigate('/admin/orders');
    } catch (error) {
      toast.error('Failed to submit order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Review Order Details</h3>
        
        {/* Required Fields Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Required Information</h4>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Client</dt>
              <dd className="text-sm font-medium">{orderDetails.clientName || 'Not selected'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Subject Name</dt>
              <dd className="text-sm font-medium">{orderDetails.subjectName || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Video Type</dt>
              <dd className="text-sm font-medium">{orderDetails.videoType || 'Not selected'}</dd>
            </div>
          </dl>
        </div>

        {/* Optional Selections Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Optional Selections</h4>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Background Music</dt>
              <dd className="text-sm font-medium">{orderDetails.backgroundMusic ? 'Selected' : 'Not selected'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Cover Image</dt>
              <dd className="text-sm font-medium">{orderDetails.coverImage ? 'Selected' : 'Not selected'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Scenery</dt>
              <dd className="text-sm font-medium">{orderDetails.scenery ? 'Selected' : 'Not selected'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Closing Verse</dt>
              <dd className="text-sm font-medium">{orderDetails.closingVerse ? 'Selected' : 'Not selected'}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white",
              "bg-indigo-600 rounded-md hover:bg-indigo-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              "focus:ring-indigo-500"
            )}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}