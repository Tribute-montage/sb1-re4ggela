import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthService } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.resetPassword(email);
      toast.success('Password reset instructions sent to your email');
      onCancel();
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
              "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            )}
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md",
              "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Instructions'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}