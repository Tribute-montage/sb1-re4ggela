import React from 'react';
import { AssetSelector } from './AssetSelector';
import { Asset } from '../../../types/order';

interface BackgroundMusicStepProps {
  selectedId?: string;
  onSelect: (asset: Asset | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BackgroundMusicStep(props: BackgroundMusicStepProps) {
  return (
    <AssetSelector
      {...props}
      type="music"
      title="Select Background Music"
      description="Choose the perfect background music for your tribute montage. You can preview each track before making your selection."
    />
  );
}