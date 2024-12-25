import React from 'react';
import { AssetSelector } from './AssetSelector';
import { Asset } from '../../../types/order';

interface CoverImageStepProps {
  selectedId?: string;
  onSelect: (asset: Asset | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CoverImageStep(props: CoverImageStepProps) {
  return (
    <AssetSelector
      {...props}
      type="cover"
      title="Select Cover Image"
      description="Choose a beautiful cover image that will be displayed at the beginning of your tribute montage."
    />
  );
}