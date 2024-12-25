import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminUser } from '../../lib/auth/adminService';
import { adminRegistrationSchema } from '../../lib/auth/validation';
import { AdminRegistrationFields } from './forms/AdminRegistrationFields';
import { SubmitButton } from './forms/SubmitButton';
import { toast } from 'sonner';

export function AdminRegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      adminRegistrationSchema.parse({ email, password, name });
      
      setLoading(true);
      await createAdminUser(email, password, name);
      toast.success('Admin account created successfully! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Admin registration error:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin Account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <AdminRegistrationFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
          />

          <SubmitButton
            loading={loading}
            text="Create Admin Account"
            loadingText="Creating account..."
          />
        </form>
      </div>
    </div>
  );
}