import { cn } from '../../../lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, id, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={cn(
          "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
          "focus:border-indigo-500 focus:ring-indigo-500",
          props.className
        )}
      />
    </div>
  );
}