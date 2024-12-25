import React from 'react';
import { FormField } from './FormField';

interface Client {
  id: string;
  name: string;
}

interface ClientSelectProps extends React.ComponentPropsWithoutRef<'select'> {
  clients: Client[];
  error?: { message?: string };
}

export const ClientSelect = React.forwardRef<HTMLSelectElement, ClientSelectProps>(
  ({ clients, error, ...props }, ref) => {
    return (
      <FormField
        ref={ref}
        as="select"
        label="Client"
        error={error}
        required
        {...props}
      >
        <option value="">Select a client</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </FormField>
    );
  }
);

ClientSelect.displayName = 'ClientSelect';