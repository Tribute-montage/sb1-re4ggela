import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminRegistrationFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loading: boolean;
}

export function AdminRegistrationFields({
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  showPassword,
  setShowPassword,
  loading,
}: AdminRegistrationFieldsProps) {
  return (
    <div className="rounded-md shadow-sm space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={cn(
            "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300",
            "placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500",
            "focus:border-indigo-500 sm:text-sm"
          )}
          placeholder="John Doe"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cn(
            "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300",
            "placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500",
            "focus:border-indigo-500 sm:text-sm"
          )}
          placeholder="admin@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className={cn(
              "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300",
              "placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500",
              "focus:border-indigo-500 sm:text-sm pr-10"
            )}
            placeholder="••••••••"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}