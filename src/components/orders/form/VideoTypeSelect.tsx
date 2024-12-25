import React from 'react';
import { FormField } from './FormField';

interface VideoTypeSelectProps extends React.ComponentPropsWithoutRef<'select'> {
  error?: { message?: string };
}

export const VideoTypeSelect = React.forwardRef<HTMLSelectElement, VideoTypeSelectProps>(
  ({ error, ...props }, ref) => {
    return (
      <FormField
        ref={ref}
        as="select"
        label="Video Type"
        error={error}
        required
        {...props}
      >
        <option value="">Select a video type</option>
        <option value="6min-basic">6 Minutes Basic</option>
        <option value="6min-scenery">6 Minutes with Scenery</option>
        <option value="9min-basic">9 Minutes Basic</option>
        <option value="9min-scenery">9 Minutes with Scenery</option>
      </FormField>
    );
  }
);

VideoTypeSelect.displayName = 'VideoTypeSelect';