import React from 'react';
import { AssetSelector } from './AssetSelector';
import { Asset } from '../../../types/order';

interface SceneryStepProps {
  selectedId?: string;
  onSelect: (asset: Asset | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SceneryStep(props: SceneryStepProps) {
  return (
    <AssetSelector
      {...props}
      type="scenery"
      title="Select Scenery"
      description="Choose scenic backgrounds that will be used as transitions between photos and videos."
    />
  );
}