import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { toast } from 'sonner';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In development, bypass login form
    if (import.meta.env.DEV) {
      await signIn('editor@test.com', 'password');
      return;
    }

    // Normal login flow for production
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      await signIn(email, password);
    } catch (error) {
      setError('Failed to sign in');
      toast.error('Failed to sign in');
    }
  };

  // In development, auto-submit the form
  if (import.meta.env.DEV) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Development Login
            </h2>
          </div>
          <button
            onClick={() => signIn('editor@test.com', 'password')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue as Editor
          </button>
        </div>
      </div>
    );
  }

  // Production login form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... rest of the login form code ... */}
    </form>
  );
}