import React from 'react';
import { AssetSelector } from './AssetSelector';
import { Asset } from '../../../types/order';

interface ClosingVerseStepProps {
  selectedId?: string;
  onSelect: (asset: Asset | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClosingVerseStep(props: ClosingVerseStepProps) {
  return (
    <AssetSelector
      {...props}
      type="verse"
      title="Select Closing Verse"
      description="Choose a meaningful verse or quote to end your tribute montage."
    />
  );
}