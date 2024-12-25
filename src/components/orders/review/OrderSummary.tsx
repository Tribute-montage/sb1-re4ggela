import React from 'react';
import { Clock, User, Video, Music, Image, Film, BookText } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OrderSummaryProps {
  orderDetails: any;
}

export function OrderSummary({ orderDetails }: OrderSummaryProps) {
  const sections = [
    {
      title: 'Order Details',
      icon: Clock,
      items: [
        { label: 'Order Number', value: orderDetails.orderNumber },
        { label: 'Funeral Home', value: orderDetails.funeralHome },
        { label: 'Delivery Date', value: new Date(orderDetails.requestedDeliveryDate).toLocaleDateString() },
      ],
    },
    {
      title: 'Subject Information',
      icon: User,
      items: [
        { label: 'Name', value: orderDetails.subjectName },
        { label: 'Date of Birth', value: orderDetails.dateOfBirth },
        { label: 'Date of Death', value: orderDetails.dateOfDeath },
      ],
    },
    {
      title: 'Video Options',
      icon: Video,
      items: [
        { label: 'Video Type', value: orderDetails.videoType },
        { label: 'Duration', value: orderDetails.videoType.includes('6min') ? '6 minutes' : '9 minutes' },
      ],
    },
    {
      title: 'Selected Assets',
      icon: Music,
      items: [
        { label: 'Background Music', value: orderDetails.backgroundMusic ? 'Selected' : 'None' },
        { label: 'Cover Image', value: orderDetails.coverImage ? 'Selected' : 'None' },
        { label: 'Scenery', value: orderDetails.scenery ? 'Selected' : 'None' },
        { label: 'Closing Verse', value: orderDetails.closingVerse ? 'Selected' : 'None' },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {sections.map((section) => (
        <div key={section.title} className="p-6">
          <div className="flex items-center mb-4">
            <section.icon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.label}>
                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.value || 'Not specified'}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {orderDetails.specialNotes && (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Special Notes</h3>
          <p className="text-sm text-gray-600">{orderDetails.specialNotes}</p>
        </div>
      )}
    </div>
  );
}